import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withAuth } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  const user = await withAuth();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const threads = await prisma.messageThread.findMany({
    where: {
      participantIds: { contains: user.id },
    },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: threads });
}

export async function POST(request: NextRequest) {
  const user = await withAuth();
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { recipientId, subject, content } = body;

    if (!recipientId || !content) {
      return NextResponse.json(
        { error: "recipientId and content are required" },
        { status: 400 }
      );
    }

    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    const participantIds = JSON.stringify([user.id, recipientId]);

    const thread = await prisma.messageThread.create({
      data: {
        subject,
        participantIds,
        messages: {
          create: {
            senderId: user.id,
            content,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({ data: thread }, { status: 201 });
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json({ error: "Failed to create message thread" }, { status: 500 });
  }
}
