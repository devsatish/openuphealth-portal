import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRole } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  const result = await withRole("super_admin");
  if (result.error) return result.error;

  const [
    totalUsers,
    totalPatients,
    totalTherapists,
    totalOrganizations,
    totalAppointments,
    activeAppointments,
    totalMoodCheckins,
    totalAssessments,
    totalInvoices,
    paidInvoiceRevenue,
    totalMessages,
    totalContentResources,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "patient" } }),
    prisma.user.count({ where: { role: "therapist" } }),
    prisma.organization.count(),
    prisma.appointment.count(),
    prisma.appointment.count({
      where: { status: { in: ["scheduled", "confirmed"] } },
    }),
    prisma.moodCheckin.count(),
    prisma.assessment.count(),
    prisma.invoice.count(),
    prisma.invoice.aggregate({
      where: { status: "paid" },
      _sum: { amountCents: true },
    }),
    prisma.message.count(),
    prisma.contentResource.count({ where: { published: true } }),
  ]);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [newUsersLast30Days, appointmentsLast30Days] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.appointment.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
  ]);

  return NextResponse.json({
    data: {
      users: {
        total: totalUsers,
        patients: totalPatients,
        therapists: totalTherapists,
        newLast30Days: newUsersLast30Days,
      },
      organizations: {
        total: totalOrganizations,
      },
      appointments: {
        total: totalAppointments,
        active: activeAppointments,
        last30Days: appointmentsLast30Days,
      },
      engagement: {
        moodCheckins: totalMoodCheckins,
        assessments: totalAssessments,
        messages: totalMessages,
      },
      content: {
        published: totalContentResources,
      },
      billing: {
        totalInvoices,
        totalRevenueCents: paidInvoiceRevenue._sum.amountCents || 0,
      },
    },
  });
}
