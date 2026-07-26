const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

async function main() {
  // 1. Create default company
  const company = await prisma.company.upsert({
    where: { slug: 'nexhire' },
    update: {},
    create: { name: 'NexHire AI', slug: 'nexhire' }
  });

  // 2. Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@nexhire.ai' },
    update: {},
    create: {
      email: 'admin@nexhire.ai',
      password: hashedPassword,
      role: 'ADMIN',
      companyId: company.id
    }
  });

  // 3. Clear existing jobs for a clean slate
  await prisma.job.deleteMany({ where: { companyId: company.id } });

  // 4. Create sample jobs
  await prisma.job.createMany({
    data: [
      { 
        companyId: company.id, 
        title: 'Senior Frontend Engineer (React/Next.js)', 
        department: 'Engineering', 
        description: 'We are looking for a Senior Frontend Engineer to lead the development of our core web applications. You will be responsible for architecting scalable frontend systems using React, Next.js, and TypeScript. Experience with state management (Redux/Zustand), TailwindCSS, and integrating with RESTful/GraphQL APIs is required. You must have a strong eye for UI/UX details and performance optimization.', 
        location: 'Jakarta, Indonesia (Hybrid)', 
        type: 'FULL_TIME' 
      },
      { 
        companyId: company.id, 
        title: 'Lead AI Engineer', 
        department: 'AI/ML', 
        description: 'Join our cutting-edge AI labs! We need a Lead AI Engineer to design and deploy Large Language Model (LLM) solutions. You will build Agentic workflows using LangChain, LangGraph, and Python. Solid experience with RAG architecture, vector databases (Pinecone/Milvus), and prompt engineering is a must. You will collaborate closely with product teams to embed generative AI features into our ATS platform.', 
        location: 'Remote', 
        type: 'FULL_TIME' 
      },
      { 
        companyId: company.id, 
        title: 'Product Manager - AI Platform', 
        department: 'Product', 
        description: 'As a Product Manager for our AI Platform, you will bridge the gap between engineering and business. You will define the product roadmap, gather user feedback, and manage stakeholders. We are looking for someone with a deep understanding of AI trends, user-centric design (UI/UX), and agile methodologies. Previous experience shipping AI-powered SaaS products is a huge plus.', 
        location: 'Singapore (On-site)', 
        type: 'FULL_TIME' 
      },
      { 
        companyId: company.id, 
        title: 'DevOps & MLOps Engineer', 
        department: 'Infrastructure', 
        description: 'We are scaling our infrastructure and need a DevOps/MLOps Engineer. Your role will involve managing AWS/GCP cloud environments, setting up CI/CD pipelines, and maintaining Kubernetes clusters. A significant part of this role is MLOps: deploying machine learning models, monitoring inference APIs, and managing GPU resources for LLM hosting.', 
        location: 'Remote', 
        type: 'CONTRACT' 
      },
      { 
        companyId: company.id, 
        title: 'UX/UI Designer', 
        department: 'Design', 
        description: 'We are looking for a passionate UX/UI Designer to craft beautiful and intuitive interfaces. You will create wireframes, prototypes, and high-fidelity designs using Figma. You should have a deep understanding of user psychology, typography, and modern design systems. Experience designing dashboards, B2B SaaS platforms, and interactive micro-animations is highly desired.', 
        location: 'Bali, Indonesia', 
        type: 'FULL_TIME' 
      },
      { 
        companyId: company.id, 
        title: 'Backend Developer (Node.js/Prisma)', 
        department: 'Engineering', 
        description: 'Looking for a solid Backend Developer to build and maintain our core APIs. You will work extensively with Node.js, Express, and Prisma ORM connecting to PostgreSQL databases. Responsibilities include optimizing database queries, implementing secure authentication, and handling BullMQ background jobs. Clean code and test-driven development (Jest) are expected.', 
        location: 'Jakarta, Indonesia (Hybrid)', 
        type: 'FULL_TIME' 
      }
    ],
    skipDuplicates: true
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
