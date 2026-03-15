import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { constructWebhookEvent } from "@/lib/stripe";
import { logAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;

  try {
    event = await constructWebhookEvent(body, signature);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as unknown as Record<string, unknown>;
        const userId = (session.metadata as Record<string, string>)?.userId;

        if (userId && session.subscription) {
          await prisma.subscription.create({
            data: {
              userId,
              stripeSubscriptionId: session.subscription as string,
              plan: "individual",
              status: "active",
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
        }

        await logAudit({
          userId: userId || undefined,
          action: "stripe.checkout_completed",
          resourceType: "Subscription",
          metadata: { sessionId: session.id },
        });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as unknown as Record<string, unknown>;
        const customerEmail = invoice.customer_email as string;

        if (customerEmail) {
          const user = await prisma.user.findUnique({
            where: { email: customerEmail },
          });

          if (user) {
            await prisma.invoice.create({
              data: {
                userId: user.id,
                stripeInvoiceId: invoice.id as string,
                amountCents: (invoice.amount_paid as number) || 0,
                status: "paid",
                description: `Invoice ${invoice.number || invoice.id}`,
                paidAt: new Date(),
              },
            });
          }
        }

        await logAudit({
          action: "stripe.invoice_paid",
          resourceType: "Invoice",
          metadata: { invoiceId: invoice.id },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as unknown as Record<string, unknown>;

        await logAudit({
          action: "stripe.invoice_payment_failed",
          resourceType: "Invoice",
          metadata: { invoiceId: invoice.id },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as unknown as Record<string, unknown>;
        const stripeSubId = subscription.id as string;

        const existingSub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: stripeSubId },
        });

        if (existingSub) {
          await prisma.subscription.update({
            where: { id: existingSub.id },
            data: {
              status: subscription.status as string,
              currentPeriodStart: new Date((subscription.current_period_start as number) * 1000),
              currentPeriodEnd: new Date((subscription.current_period_end as number) * 1000),
            },
          });
        }

        await logAudit({
          action: "stripe.subscription_updated",
          resourceType: "Subscription",
          metadata: { subscriptionId: stripeSubId, status: subscription.status },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as unknown as Record<string, unknown>;
        const stripeSubId = subscription.id as string;

        const existingSub = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: stripeSubId },
        });

        if (existingSub) {
          await prisma.subscription.update({
            where: { id: existingSub.id },
            data: { status: "canceled" },
          });
        }

        await logAudit({
          action: "stripe.subscription_deleted",
          resourceType: "Subscription",
          metadata: { subscriptionId: stripeSubId },
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
