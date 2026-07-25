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

  // 3. Create sample jobs
  await prisma.job.createMany({
    data: [
      { companyId: company.id, title: 'Frontend Engineer', department: 'Engineering', description: 'React, TypeScript, CSS', location: 'Jakarta, Indonesia', type: 'FULL_TIME' },
      { companyId: company.id, title: 'AI Engineer', department: 'AI/ML', description: 'Python, LangChain, RAG', location: 'Remote', type: 'FULL_TIME' },
      { companyId: company.id, title: 'Product Manager', department: 'Product', description: 'Roadmap, stakeholders', location: 'Jakarta, Indonesia', type: 'FULL_TIME' }
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
