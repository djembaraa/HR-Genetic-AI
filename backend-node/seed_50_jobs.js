const prisma = require('./lib/prisma');

const roles = [
  'Specialist', 'Analyst', 'Manager', 'Director', 'Coordinator', 'Consultant', 'Engineer', 'Designer', 'Architect', 'Strategist'
];
const departments = [
  'Marketing', 'Finance', 'Sales', 'Operations', 'Human Resources', 'Engineering', 'Product', 'Customer Success', 'Legal', 'Design'
];
const locations = [
  'Jakarta, Indonesia (Hybrid)', 'Bandung, Indonesia (On-site)', 'Bali, Indonesia (Remote)', 
  'Surabaya, Indonesia (On-site)', 'Yogyakarta, Indonesia (Hybrid)', 'Singapore (Remote)'
];

const descriptions = {
  Marketing: "Drive brand awareness and lead generation through innovative marketing strategies. You will oversee multi-channel campaigns, analyze market trends, and work closely with the product team to ensure messaging alignment. Requires strong analytical skills and creativity.",
  Finance: "Ensure financial health and compliance through meticulous analysis and reporting. You will manage budgets, forecast revenue, and provide actionable insights to executive leadership. Strong proficiency in financial modeling and accounting principles is required.",
  Sales: "Expand our market presence and close high-value deals. You will build relationships with key stakeholders, negotiate contracts, and meet quarterly quotas. A proven track record in B2B sales and excellent communication skills are essential.",
  Operations: "Optimize our daily processes to maximize efficiency and scalability. You will manage supply chain logistics, implement operational policies, and coordinate cross-functional teams to deliver on company objectives.",
  'Human Resources': "Foster a positive workplace culture and attract top talent. You will handle recruitment, employee relations, and performance management. Deep understanding of labor laws and excellent interpersonal skills are required.",
  Engineering: "Build robust, scalable software solutions that power our core products. You will write clean, maintainable code, participate in system architecture design, and collaborate with cross-functional teams in an Agile environment.",
  Product: "Define product vision and guide the development lifecycle from ideation to launch. You will conduct user research, write PRDs, and work closely with engineering and design to deliver features that users love.",
  'Customer Success': "Ensure our clients achieve their desired outcomes using our platform. You will onboard new users, conduct training sessions, and act as the voice of the customer to influence product development.",
  Legal: "Provide expert legal counsel to mitigate risk and ensure regulatory compliance. You will draft and review contracts, advise on data privacy matters, and represent the company in legal proceedings.",
  Design: "Craft intuitive and visually stunning user experiences. You will create wireframes, prototypes, and high-fidelity mockups, ensuring that our products are both beautiful and highly functional."
};

async function main() {
  const companies = await Promise.all([
    prisma.company.upsert({ where: { slug: 'nexhire-ai' }, create: { name: 'NexHire AI', slug: 'nexhire-ai', industry: 'Technology' }, update: {} }),
    prisma.company.upsert({ where: { slug: 'acme-corp' }, create: { name: 'ACME Corp', slug: 'acme-corp', industry: 'Finance' }, update: {} }),
    prisma.company.upsert({ where: { slug: 'horizon-ltd' }, create: { name: 'Horizon Ltd', slug: 'horizon-ltd', industry: 'Healthcare' }, update: {} }),
  ]);

  const jobs = [];
  
  // Generate 50 jobs
  for (let i = 1; i <= 50; i++) {
    const dept = departments[i % departments.length];
    const role = roles[i % roles.length];
    const location = locations[i % locations.length];
    
    // Add some prefix to make it diverse
    const prefixes = ['Senior ', 'Junior ', 'Lead ', 'Principal ', 'Chief ', '', '', 'Global '];
    const prefix = prefixes[i % prefixes.length];
    
    const title = `${prefix}${dept} ${role}`.trim();
    
    jobs.push({
      companyId: companies[i % companies.length].id,
      title: title,
      department: dept,
      location: location,
      type: i % 5 === 0 ? 'CONTRACT' : 'FULL_TIME',
      status: 'OPEN',
      description: `Role: ${title}\n\n` + descriptions[dept] + `\n\nRequirements:\n- 3+ years of relevant experience in ${dept}\n- Excellent communication and problem-solving skills\n- Ability to work effectively in a ${location.includes('Remote') ? 'remote' : 'fast-paced'} environment.`
    });
  }

  await prisma.job.createMany({ data: jobs });
  console.log(`Seeded ${jobs.length} diverse jobs successfully!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
