import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.messageThread.deleteMany();
  await prisma.moodCheckin.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.intakeForm.deleteMany();
  await prisma.insuranceInfo.deleteMany();
  await prisma.careCase.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.availabilitySlot.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.deviceRegistration.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.therapistProfile.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.contentResource.deleteMany();
  await prisma.featureFlag.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 12);

  // --- Users ---
  const patient1 = await prisma.user.create({
    data: {
      email: "patient1@openuphealth.local",
      passwordHash,
      name: "Alice Johnson",
      role: "patient",
      emailVerified: new Date(),
    },
  });

  const patient2 = await prisma.user.create({
    data: {
      email: "patient2@openuphealth.local",
      passwordHash,
      name: "Bob Williams",
      role: "patient",
      emailVerified: new Date(),
    },
  });

  const therapist1 = await prisma.user.create({
    data: {
      email: "therapist1@openuphealth.local",
      passwordHash,
      name: "Dr. Sarah Chen",
      role: "therapist",
      emailVerified: new Date(),
    },
  });

  const therapist2 = await prisma.user.create({
    data: {
      email: "therapist2@openuphealth.local",
      passwordHash,
      name: "Dr. Michael Rivera",
      role: "therapist",
      emailVerified: new Date(),
    },
  });

  const careCoordinator = await prisma.user.create({
    data: {
      email: "care1@openuphealth.local",
      passwordHash,
      name: "Emily Davis",
      role: "care_coordinator",
      emailVerified: new Date(),
    },
  });

  const orgAdmin = await prisma.user.create({
    data: {
      email: "orgadmin1@openuphealth.local",
      passwordHash,
      name: "James Thompson",
      role: "org_admin",
      emailVerified: new Date(),
    },
  });

  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@openuphealth.local",
      passwordHash,
      name: "System Admin",
      role: "super_admin",
      emailVerified: new Date(),
    },
  });

  console.log("Created users");

  // --- Patient Profiles ---
  const patientProfile1 = await prisma.patientProfile.create({
    data: {
      userId: patient1.id,
      dateOfBirth: new Date("1992-03-15"),
      phone: "+1-555-0101",
      emergencyContact: "Mark Johnson (spouse) - +1-555-0102",
      consentAcceptedAt: new Date("2025-01-10"),
      intakeCompletedAt: new Date("2025-01-10"),
    },
  });

  const patientProfile2 = await prisma.patientProfile.create({
    data: {
      userId: patient2.id,
      dateOfBirth: new Date("1988-07-22"),
      phone: "+1-555-0201",
      emergencyContact: "Lisa Williams (sister) - +1-555-0202",
      consentAcceptedAt: new Date("2025-02-01"),
      intakeCompletedAt: new Date("2025-02-01"),
    },
  });

  console.log("Created patient profiles");

  // --- Therapist Profiles ---
  const therapistProfile1 = await prisma.therapistProfile.create({
    data: {
      userId: therapist1.id,
      licenseNumber: "PSY-2024-001",
      licenseState: "CA",
      npiNumber: "1234567890",
      bio: "Dr. Sarah Chen is a licensed clinical psychologist specializing in cognitive behavioral therapy for anxiety and depression. With over 12 years of experience, she brings a warm, evidence-based approach to helping clients navigate life transitions and build resilience.",
      specialties: JSON.stringify(["anxiety", "depression", "trauma", "life_transitions"]),
      modalities: JSON.stringify(["video", "in_person"]),
      languages: JSON.stringify(["english", "mandarin"]),
      populations: JSON.stringify(["adults", "young_adults", "couples"]),
      yearsExperience: 12,
      acceptsInsurance: true,
      hourlyRate: 18000,
      isAcceptingPatients: true,
      verifiedAt: new Date("2024-12-01"),
    },
  });

  const therapistProfile2 = await prisma.therapistProfile.create({
    data: {
      userId: therapist2.id,
      licenseNumber: "LCSW-2024-042",
      licenseState: "NY",
      npiNumber: "0987654321",
      bio: "Dr. Michael Rivera is a licensed clinical social worker with expertise in mindfulness-based stress reduction and family systems therapy. He is passionate about serving diverse communities and helping individuals find their path to wellness.",
      specialties: JSON.stringify(["stress", "family_conflict", "grief", "self_esteem", "mindfulness"]),
      modalities: JSON.stringify(["video", "phone", "chat"]),
      languages: JSON.stringify(["english", "spanish"]),
      populations: JSON.stringify(["adults", "adolescents", "families", "lgbtq"]),
      yearsExperience: 8,
      acceptsInsurance: true,
      hourlyRate: 15000,
      isAcceptingPatients: true,
      verifiedAt: new Date("2024-11-15"),
    },
  });

  console.log("Created therapist profiles");

  // --- Organization ---
  const org = await prisma.organization.create({
    data: {
      name: "Acme Corp",
      slug: "acme-corp",
      type: "employer",
      contactEmail: "hr@acmecorp.example.com",
      plan: "professional",
      maxMembers: 200,
    },
  });

  await prisma.user.update({
    where: { id: orgAdmin.id },
    data: { organizationId: org.id },
  });

  console.log("Created organization");

  // --- Memberships ---
  await prisma.membership.create({
    data: {
      userId: orgAdmin.id,
      organizationId: org.id,
      role: "owner",
    },
  });

  await prisma.membership.create({
    data: {
      userId: patient1.id,
      organizationId: org.id,
      role: "member",
      eligibleThrough: new Date("2026-12-31"),
    },
  });

  console.log("Created memberships");

  // --- Availability Slots ---
  const weekdays = [1, 2, 3, 4, 5]; // Mon-Fri

  for (const day of weekdays) {
    await prisma.availabilitySlot.create({
      data: {
        therapistId: therapistProfile1.id,
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "12:00",
        isRecurring: true,
      },
    });
    await prisma.availabilitySlot.create({
      data: {
        therapistId: therapistProfile1.id,
        dayOfWeek: day,
        startTime: "14:00",
        endTime: "17:00",
        isRecurring: true,
      },
    });
  }

  for (const day of [1, 2, 3]) {
    await prisma.availabilitySlot.create({
      data: {
        therapistId: therapistProfile2.id,
        dayOfWeek: day,
        startTime: "10:00",
        endTime: "18:00",
        isRecurring: true,
      },
    });
  }

  await prisma.availabilitySlot.create({
    data: {
      therapistId: therapistProfile2.id,
      dayOfWeek: 6,
      startTime: "09:00",
      endTime: "13:00",
      isRecurring: true,
    },
  });

  console.log("Created availability slots");

  // --- Intake Forms ---
  await prisma.intakeForm.create({
    data: {
      patientId: patientProfile1.id,
      therapyGoals: JSON.stringify(["Manage work-related anxiety", "Improve sleep quality", "Build healthier coping mechanisms"]),
      preferredLanguage: "english",
      specialtyPreferences: JSON.stringify(["anxiety", "life_transitions"]),
      availability: JSON.stringify({ mornings: true, afternoons: true, evenings: false, weekends: false }),
      careFormat: "individual",
      paymentPreference: "insurance",
      additionalNotes: "I prefer female therapists. I have tried therapy before but it was not a good fit.",
      completedAt: new Date("2025-01-10"),
    },
  });

  await prisma.intakeForm.create({
    data: {
      patientId: patientProfile2.id,
      therapyGoals: JSON.stringify(["Process grief after loss of parent", "Reconnect with hobbies and interests", "Reduce feelings of isolation"]),
      preferredLanguage: "english",
      specialtyPreferences: JSON.stringify(["grief", "depression", "self_esteem"]),
      availability: JSON.stringify({ mornings: false, afternoons: true, evenings: true, weekends: true }),
      careFormat: "individual",
      paymentPreference: "self_pay",
      completedAt: new Date("2025-02-01"),
    },
  });

  console.log("Created intake forms");

  // --- Appointments ---
  const now = new Date();
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7));
  nextMonday.setHours(10, 0, 0, 0);

  const appt1 = await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      therapistId: therapist1.id,
      startsAt: nextMonday,
      endsAt: new Date(nextMonday.getTime() + 50 * 60 * 1000),
      modality: "video",
      status: "scheduled",
      notes: "Initial session - intake review and goal setting",
    },
  });

  const pastDate1 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  pastDate1.setHours(14, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      therapistId: therapist1.id,
      startsAt: pastDate1,
      endsAt: new Date(pastDate1.getTime() + 50 * 60 * 1000),
      modality: "video",
      status: "completed",
      notes: "Discussed CBT techniques for anxiety management. Assigned thought diary homework.",
    },
  });

  const pastDate2 = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  pastDate2.setHours(11, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      therapistId: therapist2.id,
      startsAt: pastDate2,
      endsAt: new Date(pastDate2.getTime() + 50 * 60 * 1000),
      modality: "phone",
      status: "completed",
      notes: "Explored grief timeline. Patient showed openness to mindfulness exercises.",
    },
  });

  const futureDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  futureDate.setHours(15, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      therapistId: therapist2.id,
      startsAt: futureDate,
      endsAt: new Date(futureDate.getTime() + 50 * 60 * 1000),
      modality: "video",
      status: "confirmed",
    },
  });

  const cancelledDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);
  cancelledDate.setHours(9, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      patientId: patient1.id,
      therapistId: therapist2.id,
      startsAt: cancelledDate,
      endsAt: new Date(cancelledDate.getTime() + 50 * 60 * 1000),
      modality: "in_person",
      status: "cancelled",
      cancelReason: "Patient requested reschedule due to work conflict",
    },
  });

  console.log("Created appointments");

  // --- Mood Checkins ---
  const moodData = [
    { patientId: patient1.id, moodScore: 4, journalText: "Feeling anxious about the presentation tomorrow. Tried the breathing exercises.", daysAgo: 7 },
    { patientId: patient1.id, moodScore: 5, journalText: "Presentation went okay. Not as bad as I expected.", daysAgo: 6 },
    { patientId: patient1.id, moodScore: 6, journalText: "Had a good conversation with my partner about my feelings.", daysAgo: 5 },
    { patientId: patient1.id, moodScore: 3, journalText: "Couldn't sleep well. Mind racing about work deadlines.", daysAgo: 4 },
    { patientId: patient1.id, moodScore: 5, journalText: "Went for a walk during lunch. It helped clear my head.", daysAgo: 3 },
    { patientId: patient1.id, moodScore: 7, journalText: "Great session with Dr. Chen today. Feeling more hopeful.", daysAgo: 2 },
    { patientId: patient1.id, moodScore: 6, journalText: "Practicing gratitude journaling. Three things I'm thankful for today.", daysAgo: 1 },
    { patientId: patient2.id, moodScore: 3, journalText: "Missing dad a lot today. Found his old jacket in the closet.", daysAgo: 6 },
    { patientId: patient2.id, moodScore: 4, journalText: "Called my sister. We shared some good memories.", daysAgo: 4 },
    { patientId: patient2.id, moodScore: 5, journalText: "Tried the body scan meditation Dr. Rivera suggested. It was soothing.", daysAgo: 2 },
    { patientId: patient2.id, moodScore: 4, journalText: "Low energy day but managed to cook a proper meal.", daysAgo: 1 },
  ];

  for (const mood of moodData) {
    const createdAt = new Date(now.getTime() - mood.daysAgo * 24 * 60 * 60 * 1000);
    await prisma.moodCheckin.create({
      data: {
        patientId: mood.patientId,
        moodScore: mood.moodScore,
        journalText: mood.journalText,
        createdAt,
      },
    });
  }

  console.log("Created mood checkins");

  // --- Assessments ---
  await prisma.assessment.create({
    data: {
      patientId: patientProfile1.id,
      type: "PHQ9",
      score: 12,
      responses: JSON.stringify([1, 2, 1, 2, 1, 1, 2, 1, 1]),
      completedAt: new Date("2025-01-10"),
    },
  });

  await prisma.assessment.create({
    data: {
      patientId: patientProfile1.id,
      type: "GAD7",
      score: 14,
      responses: JSON.stringify([2, 2, 2, 2, 2, 2, 2]),
      completedAt: new Date("2025-01-10"),
    },
  });

  await prisma.assessment.create({
    data: {
      patientId: patientProfile2.id,
      type: "PHQ9",
      score: 16,
      responses: JSON.stringify([2, 2, 2, 2, 2, 1, 2, 2, 1]),
      completedAt: new Date("2025-02-01"),
    },
  });

  console.log("Created assessments");

  // --- Message Threads ---
  const thread1 = await prisma.messageThread.create({
    data: {
      subject: "Follow-up on homework assignment",
      participantIds: JSON.stringify([patient1.id, therapist1.id]),
    },
  });

  await prisma.message.create({
    data: {
      threadId: thread1.id,
      senderId: therapist1.id,
      content: "Hi Alice, just checking in on how the thought diary is going. Have you been able to capture any automatic negative thoughts this week?",
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      readAt: new Date(now.getTime() - 1.5 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.message.create({
    data: {
      threadId: thread1.id,
      senderId: patient1.id,
      content: "Hi Dr. Chen! Yes, I've been writing in it every evening. I noticed a pattern - most of my anxious thoughts happen around 3pm when I start thinking about tomorrow's tasks. The reframing technique has been helpful.",
      createdAt: new Date(now.getTime() - 1.5 * 24 * 60 * 60 * 1000),
      readAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.message.create({
    data: {
      threadId: thread1.id,
      senderId: therapist1.id,
      content: "That's a great observation! Noticing the timing pattern is really insightful. Let's explore this more in our next session. In the meantime, try scheduling a 5-minute mindfulness break around 2:45pm.",
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  const thread2 = await prisma.messageThread.create({
    data: {
      subject: "Scheduling question",
      participantIds: JSON.stringify([patient2.id, therapist2.id]),
    },
  });

  await prisma.message.create({
    data: {
      threadId: thread2.id,
      senderId: patient2.id,
      content: "Dr. Rivera, would it be possible to move our next session to the afternoon? I have a morning commitment that week.",
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      readAt: new Date(now.getTime() - 2.5 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.message.create({
    data: {
      threadId: thread2.id,
      senderId: therapist2.id,
      content: "Of course, Bob. I have availability at 2pm and 4pm that day. Which works better for you?",
      createdAt: new Date(now.getTime() - 2.5 * 24 * 60 * 60 * 1000),
      readAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("Created message threads and messages");

  // --- Invoices ---
  await prisma.invoice.create({
    data: {
      userId: patient1.id,
      organizationId: org.id,
      amountCents: 18000,
      status: "paid",
      description: "Therapy session - Dr. Sarah Chen - Jan 15, 2025",
      paidAt: new Date("2025-01-15"),
      createdAt: new Date("2025-01-15"),
    },
  });

  await prisma.invoice.create({
    data: {
      userId: patient1.id,
      organizationId: org.id,
      amountCents: 18000,
      status: "paid",
      description: "Therapy session - Dr. Sarah Chen - Jan 22, 2025",
      paidAt: new Date("2025-01-22"),
      createdAt: new Date("2025-01-22"),
    },
  });

  await prisma.invoice.create({
    data: {
      userId: patient2.id,
      amountCents: 15000,
      status: "paid",
      description: "Therapy session - Dr. Michael Rivera - Feb 5, 2025",
      paidAt: new Date("2025-02-05"),
      createdAt: new Date("2025-02-05"),
    },
  });

  await prisma.invoice.create({
    data: {
      userId: patient1.id,
      amountCents: 18000,
      status: "open",
      description: "Therapy session - Dr. Sarah Chen - upcoming",
      createdAt: new Date(),
    },
  });

  console.log("Created invoices");

  // --- Insurance Info ---
  await prisma.insuranceInfo.create({
    data: {
      patientId: patientProfile1.id,
      carrierName: "Blue Cross Blue Shield",
      memberId: "BCB-889923456",
      groupNumber: "GRP-ACME-2025",
      planName: "PPO Gold",
      verificationStatus: "verified",
      verifiedAt: new Date("2025-01-09"),
      notes: "Mental health benefits confirmed. $20 copay per session after deductible.",
    },
  });

  await prisma.insuranceInfo.create({
    data: {
      patientId: patientProfile2.id,
      carrierName: "Aetna",
      memberId: "AET-445567890",
      groupNumber: "IND-2025",
      planName: "Select EPO",
      verificationStatus: "pending",
    },
  });

  console.log("Created insurance info");

  // --- Care Cases ---
  await prisma.careCase.create({
    data: {
      patientId: patientProfile1.id,
      coordinatorId: careCoordinator.id,
      status: "in_progress",
      priority: 1,
      notes: JSON.stringify([
        { date: "2025-01-10", note: "Patient matched with Dr. Chen. Insurance verified." },
        { date: "2025-01-22", note: "Patient progressing well. PHQ9 score improving." },
      ]),
    },
  });

  await prisma.careCase.create({
    data: {
      patientId: patientProfile2.id,
      coordinatorId: careCoordinator.id,
      status: "open",
      priority: 2,
      notes: JSON.stringify([
        { date: "2025-02-01", note: "Patient completed intake. Grief counseling needed. Matching with Dr. Rivera." },
      ]),
    },
  });

  console.log("Created care cases");

  // --- Content Resources ---
  await prisma.contentResource.create({
    data: {
      title: "Understanding Anxiety: A Beginner's Guide",
      slug: "understanding-anxiety-beginners-guide",
      type: "article",
      category: "anxiety",
      content: "Anxiety is one of the most common mental health conditions, affecting millions of people worldwide. It's important to understand that anxiety is a normal human emotion, but when it becomes persistent and overwhelming, it may require professional support.\n\n## What is Anxiety?\n\nAnxiety is your body's natural response to stress. It's a feeling of fear or apprehension about what's to come. While occasional anxiety is normal, chronic anxiety can interfere with daily activities.\n\n## Common Symptoms\n\n- Excessive worrying\n- Restlessness or feeling on edge\n- Difficulty concentrating\n- Sleep disturbances\n- Physical symptoms like rapid heartbeat or sweating\n\n## When to Seek Help\n\nIf anxiety is affecting your daily life, relationships, or work performance, it may be time to speak with a mental health professional.",
      published: true,
    },
  });

  await prisma.contentResource.create({
    data: {
      title: "5-Minute Breathing Exercise for Stress Relief",
      slug: "5-minute-breathing-exercise",
      type: "exercise",
      category: "mindfulness",
      content: "This simple breathing exercise can help you calm your nervous system in just five minutes.\n\n## The 4-7-8 Technique\n\n1. **Inhale** through your nose for 4 seconds\n2. **Hold** your breath for 7 seconds\n3. **Exhale** slowly through your mouth for 8 seconds\n4. Repeat 4 times\n\n## Tips\n\n- Find a comfortable seated position\n- Close your eyes if it feels comfortable\n- Place one hand on your chest and one on your belly\n- Focus on your belly rising and falling\n\nPractice this exercise whenever you feel stressed, anxious, or need a mental reset.",
      published: true,
    },
  });

  await prisma.contentResource.create({
    data: {
      title: "Navigating Grief: Honoring Your Journey",
      slug: "navigating-grief-honoring-journey",
      type: "article",
      category: "self-care",
      content: "Grief is a deeply personal experience, and there is no right or wrong way to grieve. Whether you've lost a loved one, a relationship, or experienced another significant loss, your feelings are valid.\n\n## The Grief Process\n\nGrief doesn't follow a linear path. You may experience waves of sadness, anger, numbness, and even moments of peace. All of these are normal.\n\n## Self-Care During Grief\n\n- Allow yourself to feel without judgment\n- Maintain basic routines when possible\n- Reach out to supportive people in your life\n- Consider joining a support group\n- Be patient with yourself\n\n## Professional Support\n\nA therapist who specializes in grief counseling can provide a safe space to process your emotions and develop coping strategies.",
      published: true,
    },
  });

  await prisma.contentResource.create({
    data: {
      title: "Daily Gratitude Practice Worksheet",
      slug: "daily-gratitude-worksheet",
      type: "worksheet",
      category: "self-care",
      content: "Research shows that practicing gratitude can improve mental well-being and overall life satisfaction.\n\n## Morning Gratitude\n\nWrite three things you're grateful for this morning:\n1. _____________\n2. _____________\n3. _____________\n\n## Evening Reflection\n\nWhat was the best part of your day?\n_____________\n\nWho made a positive impact on your day?\n_____________\n\nWhat is something you accomplished today, no matter how small?\n_____________",
      published: true,
    },
  });

  await prisma.contentResource.create({
    data: {
      title: "Understanding Depression in Young Adults",
      slug: "understanding-depression-young-adults",
      type: "article",
      category: "depression",
      content: "Depression among young adults is more common than many people realize. This article explores the unique challenges young adults face and how to recognize the signs.",
      published: false,
    },
  });

  console.log("Created content resources");

  // --- Feature Flags ---
  await prisma.featureFlag.create({
    data: {
      key: "video_sessions",
      enabled: true,
      description: "Enable video session functionality for appointments",
    },
  });

  await prisma.featureFlag.create({
    data: {
      key: "ai_matching",
      enabled: false,
      description: "Use AI-powered therapist matching algorithm",
    },
  });

  await prisma.featureFlag.create({
    data: {
      key: "group_therapy",
      enabled: false,
      description: "Enable group therapy session booking",
    },
  });

  await prisma.featureFlag.create({
    data: {
      key: "mobile_push_notifications",
      enabled: true,
      description: "Send push notifications to mobile devices",
    },
  });

  await prisma.featureFlag.create({
    data: {
      key: "insurance_auto_verify",
      enabled: false,
      description: "Automatically verify insurance through API integration",
    },
  });

  await prisma.featureFlag.create({
    data: {
      key: "mood_insights",
      enabled: true,
      description: "Show mood trend insights and analytics to patients",
    },
  });

  console.log("Created feature flags");

  // --- Notification Preferences ---
  await prisma.notificationPreference.create({
    data: { userId: patient1.id, emailEnabled: true, smsEnabled: false, pushEnabled: true, marketingEnabled: true },
  });

  await prisma.notificationPreference.create({
    data: { userId: patient2.id, emailEnabled: true, smsEnabled: true, pushEnabled: true, marketingEnabled: false },
  });

  await prisma.notificationPreference.create({
    data: { userId: therapist1.id, emailEnabled: true, smsEnabled: false, pushEnabled: true, marketingEnabled: false },
  });

  console.log("Created notification preferences");

  // --- Payment Methods ---
  await prisma.paymentMethod.create({
    data: {
      userId: patient1.id,
      type: "card",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
    },
  });

  await prisma.paymentMethod.create({
    data: {
      userId: patient2.id,
      type: "card",
      last4: "1234",
      expiryMonth: 6,
      expiryYear: 2026,
      isDefault: true,
    },
  });

  console.log("Created payment methods");

  // --- Audit Logs ---
  const auditEntries = [
    { userId: patient1.id, action: "user.login", metadata: { method: "credentials" } },
    { userId: patient1.id, action: "intake.submitted", resourceType: "IntakeForm" },
    { userId: patient1.id, action: "appointment.created", resourceType: "Appointment" },
    { userId: therapist1.id, action: "user.login", metadata: { method: "credentials" } },
    { userId: therapist1.id, action: "appointment.updated", resourceType: "Appointment", metadata: { status: "completed" } },
    { userId: careCoordinator.id, action: "user.login", metadata: { method: "credentials" } },
    { userId: careCoordinator.id, action: "insurance.verified", resourceType: "InsuranceInfo" },
    { userId: superAdmin.id, action: "user.login", metadata: { method: "credentials" } },
    { userId: superAdmin.id, action: "feature_flag.updated", resourceType: "FeatureFlag", metadata: { key: "video_sessions", enabled: true } },
    { userId: orgAdmin.id, action: "membership.created", resourceType: "Membership" },
  ];

  for (const entry of auditEntries) {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        resourceType: entry.resourceType || null,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
        ipAddress: "127.0.0.1",
      },
    });
  }

  console.log("Created audit logs");

  console.log("\nSeed completed successfully!");
  console.log("\nTest accounts (all use password: password123):");
  console.log("  patient1@openuphealth.local (patient)");
  console.log("  patient2@openuphealth.local (patient)");
  console.log("  therapist1@openuphealth.local (therapist)");
  console.log("  therapist2@openuphealth.local (therapist)");
  console.log("  care1@openuphealth.local (care_coordinator)");
  console.log("  orgadmin1@openuphealth.local (org_admin)");
  console.log("  admin@openuphealth.local (super_admin)");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
