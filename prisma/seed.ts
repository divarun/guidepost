import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.aiInteraction.deleteMany();
  await prisma.job.deleteMany();
  await prisma.essayFeedback.deleteMany();
  await prisma.essayVersion.deleteMany();
  await prisma.essay.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Student 1
  const student1 = await prisma.user.create({
    data: {
      email: 'student1@example.com',
      passwordHash: hashedPassword,
      role: 'STUDENT',
      firstName: 'Alex',
      lastName: 'Johnson',
      graduationYear: 2025,
      gpa: 3.8,
    },
  });

  // Student 2
  const student2 = await prisma.user.create({
    data: {
      email: 'student2@example.com',
      passwordHash: hashedPassword,
      role: 'STUDENT',
      firstName: 'Sarah',
      lastName: 'Williams',
      graduationYear: 2025,
      gpa: 3.9,
    },
  });

  // Parent for Student 1
  const parent1 = await prisma.user.create({
    data: {
      email: 'parent1@example.com',
      passwordHash: hashedPassword,
      role: 'PARENT',
      firstName: 'Michael',
      lastName: 'Johnson',
      studentId: student1.id,
    },
  });

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
    },
  });

  console.log('✅ Created users');

  // Create tasks for Student 1
  const studentTasks = await prisma.task.createMany({
    data: [
      {
        userId: student1.id,
        title: 'Complete Common App Essay',
        description: 'Write and revise the main Common Application essay (650 words max)',
        category: 'ESSAY',
        status: 'IN_PROGRESS',
        priority: 1,
        dueDate: new Date('2025-12-15'),
      },
      {
        userId: student1.id,
        title: 'Take SAT',
        description: 'Register and complete SAT examination',
        category: 'TESTING',
        status: 'COMPLETED',
        priority: 1,
        dueDate: new Date('2024-10-05'),
        completedAt: new Date('2024-10-05'),
      },
      {
        userId: student1.id,
        title: 'Request Teacher Recommendations',
        description: 'Ask Ms. Smith (English) and Mr. Davis (Math) for recommendation letters',
        category: 'APPLICATION',
        status: 'COMPLETED',
        priority: 1,
        dueDate: new Date('2024-09-30'),
        completedAt: new Date('2024-09-28'),
      },
      {
        userId: student1.id,
        title: 'Update Activities Resume',
        description: 'Document all extracurricular activities, leadership roles, and achievements',
        category: 'EXTRACURRICULAR',
        status: 'IN_PROGRESS',
        priority: 2,
        dueDate: new Date('2025-11-30'),
      },
      {
        userId: student1.id,
        title: 'Visit Stanford Campus',
        description: 'Schedule and attend campus visit and information session',
        category: 'OTHER',
        status: 'NOT_STARTED',
        priority: 3,
        dueDate: new Date('2025-03-15'),
      },
    ],
  });

  console.log('✅ Created student tasks');

  // Create parent tasks
  const parentTasks = await prisma.task.createMany({
    data: [
      {
        userId: parent1.id,
        title: 'Complete FAFSA',
        description: 'Fill out Free Application for Federal Student Aid',
        category: 'FAFSA',
        status: 'NOT_STARTED',
        priority: 1,
        dueDate: new Date('2025-01-15'),
      },
      {
        userId: parent1.id,
        title: 'Submit CSS Profile',
        description: 'Complete CSS Profile for institutional financial aid',
        category: 'CSS_PROFILE',
        status: 'NOT_STARTED',
        priority: 1,
        dueDate: new Date('2025-02-01'),
      },
      {
        userId: parent1.id,
        title: 'Research Scholarships',
        description: 'Identify and apply for external scholarship opportunities',
        category: 'SCHOLARSHIP',
        status: 'IN_PROGRESS',
        priority: 2,
        dueDate: new Date('2025-03-01'),
      },
      {
        userId: parent1.id,
        title: 'Gather Tax Documents',
        description: 'Collect 2024 tax returns and W-2 forms for financial aid applications',
        category: 'FINANCIAL_AID',
        status: 'IN_PROGRESS',
        priority: 1,
        dueDate: new Date('2025-01-31'),
      },
    ],
  });

  console.log('✅ Created parent tasks');

  // Create essays
  const essay1 = await prisma.essay.create({
    data: {
      userId: student1.id,
      title: 'Common App Essay - Personal Growth',
      prompt: 'Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.',
      content: `The summer before my junior year, I stood in front of 30 elementary school students, my lesson plan crumpled in my sweaty palm. As a volunteer reading tutor, I had expected eager faces and quick progress. Instead, I faced a room of restless energy and reading levels spanning five grades.

That first day was chaos. My carefully planned phonics games fell flat. Students wandered off. One child told me, "Reading is boring." I went home questioning whether I could make any difference at all.

But I returned the next week with a new approach. Instead of imposing my curriculum, I asked each student what they wanted to read about. Dinosaurs. Basketball. Fairy tales. Space exploration. I brought books that matched their interests and reading levels. Slowly, something shifted.

Marcus, who had insisted he hated reading, devoured every book about sharks I could find. By August, he was reading two grade levels above where he started. Sarah, who was shy about reading aloud, blossomed when I let her teach a younger student the strategies she'd learned.

That summer taught me that effective teaching isn't about having the perfect plan—it's about adapting to meet people where they are. This insight has shaped how I approach leadership in my debate team and peer tutoring. I've learned to listen first, then adjust my approach based on what I learn.

The experience also ignited my passion for educational equity. I'm now developing an after-school literacy program at my school, training other student volunteers in differentiated instruction techniques. We've served 50 students this year.

As I prepare for college, I carry forward the lessons from that chaotic first day: genuine connection creates engagement, flexibility enables growth, and persistence through challenges leads to meaningful impact.`,
      wordCount: 287,
      status: 'IN_REVIEW',
      schoolName: 'Common Application',
      dueDate: new Date('2025-12-15'),
    },
  });

  // Create essay version
  await prisma.essayVersion.create({
    data: {
      essayId: essay1.id,
      content: essay1.content,
      wordCount: essay1.wordCount,
      version: 1,
      notes: 'Initial draft',
    },
  });

  const essay2 = await prisma.essay.create({
    data: {
      userId: student1.id,
      title: 'Stanford - Intellectual Vitality',
      prompt: 'The Stanford community is deeply curious and driven to learn in and out of the classroom. Reflect on an idea or experience that makes you genuinely excited about learning.',
      content: `Last year, I stumbled across a paper about using machine learning to predict protein folding. I didn't understand most of it, but one phrase caught my attention: "solving the protein folding problem could revolutionize drug discovery."

I spent the next three months teaching myself Python, linear algebra, and the basics of biochemistry. I watched lectures from MIT OpenCourseWare at 2 AM. I filled notebooks with questions my biology teacher couldn't answer, which led me to email professors at nearby universities.

Dr. Chen at State University responded. She invited me to her lab, where I saw firsthand how computational biology bridges my two passions: computer science and biology. I learned about AlphaFold's breakthrough and joined an online community of students working on similar problems.

This rabbit hole became my independent study project. I built a simple neural network to classify protein structures—nothing groundbreaking, but the process taught me how to approach complex problems systematically. More importantly, it showed me that the most exciting learning happens at the intersection of disciplines.

At Stanford, I want to explore that intersection further. The opportunities to combine computational methods with biological research, to work alongside researchers pushing the boundaries of what's possible, genuinely excite me. I'm ready to dive down more rabbit holes, ask more questions my teachers can't answer, and contribute to research that could change lives.`,
      wordCount: 234,
      status: 'DRAFT',
      schoolName: 'Stanford University',
      dueDate: new Date('2025-01-05'),
    },
  });

  console.log('✅ Created essays');

  // Create budgets
  await prisma.budget.createMany({
    data: [
      {
        userId: parent1.id,
        schoolName: 'Stanford University',
        tuitionCost: 61731,
        roomAndBoard: 19922,
        booksAndSupplies: 1245,
        otherExpenses: 2130,
        expectedAid: 45000,
        scholarships: 5000,
        notes: 'Need-based aid estimate from NPC. Applied for external scholarships.',
      },
      {
        userId: parent1.id,
        schoolName: 'UC Berkeley',
        tuitionCost: 14226,
        roomAndBoard: 18632,
        booksAndSupplies: 1040,
        otherExpenses: 1794,
        expectedAid: 12000,
        scholarships: 3000,
        notes: 'In-state tuition. Cal Grant eligible.',
      },
      {
        userId: parent1.id,
        schoolName: 'University of Michigan',
        tuitionCost: 17786,
        roomAndBoard: 13996,
        booksAndSupplies: 1048,
        otherExpenses: 2454,
        expectedAid: 8000,
        scholarships: 2000,
        notes: 'Out-of-state. Merit scholarship possible.',
      },
    ],
  });

  console.log('✅ Created budgets');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📧 Test accounts:');
  console.log('Student: student1@example.com / password123');
  console.log('Parent: parent1@example.com / password123');
  console.log('Admin: admin@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });