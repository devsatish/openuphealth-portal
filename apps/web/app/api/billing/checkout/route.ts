import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/rbac";
import { createCheckoutSession } from "@/lib/stripe";
import { logAudit } from "@/lib/audit";

export async function POST(request: NextRequest) {
  const user = await withAuth();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { priceId } = body;

    if (!priceId) {
      return NextResponse.json({ error: "priceId is required" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await createCheckoutSession({
      priceId,
      successUrl: `${appUrl}/app/billing?success=true`,
      cancelUrl: `${appUrl}/app/billing?canceled=true`,
      metadata: {
        userId: user.id,
      },
    });

    await logAudit({
      userId: user.id,
      action: "billing.checkout_started",
      resourceType: "CheckoutSession",
      resourceId: session.id,
    });

    return NextResponse.json({ data: { url: session.url } });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
