import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/rbac";
import { logAudit } from "@/lib/audit";

export async function GET(request: NextRequest) {
  const user = await withAuth();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const methods = await prisma.paymentMethod.findMany({
    where: { userId: user.id },
    orderBy: { isDefault: "desc" },
  });

  return NextResponse.json({ data: methods });
}

export async function POST(request: NextRequest) {
  const user = await withAuth();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { stripePaymentMethodId, type, last4, expiryMonth, expiryYear, isDefault } = body;

    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const method = await prisma.paymentMethod.create({
      data: {
        userId: user.id,
        stripePaymentMethodId,
        type,
        last4,
        expiryMonth,
        expiryYear,
        isDefault: isDefault ?? false,
      },
    });

    await logAudit({
      userId: user.id,
      action: "payment_method.added",
      resourceType: "PaymentMethod",
      resourceId: method.id,
    });

    return NextResponse.json({ data: method }, { status: 201 });
  } catch (error) {
    console.error("Error adding payment method:", error);
    return NextResponse.json({ error: "Failed to add payment method" }, { status: 500 });
  }
}
