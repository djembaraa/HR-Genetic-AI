const prisma = require('./lib/prisma');

async function main() {
  const companies = await Promise.all([
    prisma.company.upsert({ where: { slug: 'nexhire-ai' }, create: { name: 'NexHire AI', slug: 'nexhire-ai', industry: 'Technology' }, update: {} }),
    prisma.company.upsert({ where: { slug: 'acme-corp' }, create: { name: 'ACME Corp', slug: 'acme-corp', industry: 'Finance' }, update: {} }),
    prisma.company.upsert({ where: { slug: 'horizon-ltd' }, create: { name: 'Horizon Ltd', slug: 'horizon-ltd', industry: 'Healthcare' }, update: {} }),
  ]);

  const jobs = [
    {
      companyId: null,
      title: 'Digital Marketing Manager',
      department: 'Marketing',
      location: 'Jakarta, Indonesia (Hybrid)',
      type: 'FULL_TIME',
      status: 'OPEN',
      description: `We are seeking an experienced Digital Marketing Manager to lead our online marketing strategies.

Responsibilities:
- Plan and execute all digital marketing, including SEO/SEM, marketing database, email, social media and display advertising campaigns
- Design, build and maintain our social media presence
- Measure and report performance of all digital marketing campaigns, and assess against goals (ROI and KPIs)
- Identify trends and insights, and optimize spend and performance based on the insights

Requirements:
- BS/MS degree in marketing or a related field
- Proven working experience in digital marketing
- Demonstrable experience leading and managing SEO/SEM, marketing database, email, social media and/or display advertising campaigns
- Highly creative with experience in identifying target audiences and devising digital campaigns that engage, inform and motivate`
    },
    {
      companyId: null,
      title: 'Human Resources Director',
      department: 'Human Resources',
      location: 'Bandung, Indonesia (On-site)',
      type: 'FULL_TIME',
      status: 'OPEN',
      description: `We are looking for an experienced Human Resources Director to ensure that all human resources operations are carried on smoothly and effectively.

Responsibilities:
- Develop corporate plans for a variety of HR matters such as compensation, benefits, health and safety etc.
- Act to support the human factor in the company by devising strategies for performance evaluation, staffing, training and development etc.
- Oversee all HR initiatives, systems and tactics
- Supervise the work of HR personnel and provide guidance
- Serve as the point of contact for employment relations and communicate with labor unions

Requirements:
- Proven experience as HR Director
- Full understanding of the way an organization operates to meet its objectives
- Excellent knowledge of employment legislation and regulations
- Thorough knowledge of human resource management principles and best practices`
    },
    {
      companyId: null,
      title: 'Financial Analyst',
      department: 'Finance',
      location: 'Surabaya, Indonesia (Remote)',
      type: 'FULL_TIME',
      status: 'OPEN',
      description: `We are looking for a Financial Analyst to provide accurate and data-based information on company's profitability, solvency, stability and liquidity.

Responsibilities:
- Consolidate and analyze financial data (budgets, income statement forecasts etc) taking into account company's goals and financial standing
- Provide creative alternatives and recommendations to reduce costs and improve financial performance
- Assemble and summarize data to structure sophisticated reports on financial status and risks
- Develop financial models, conduct benchmarking and process analysis

Requirements:
- Proven working experience as a Finance Analyst
- Proficient in spreadsheets, databases, MS Office and financial software applications
- Hands on experience with statistical analysis and statistical packages
- Outstanding presentation, reporting and communication skills`
    },
    {
      companyId: null,
      title: 'Sales Executive',
      department: 'Sales',
      location: 'Bali, Indonesia (On-site)',
      type: 'FULL_TIME',
      status: 'OPEN',
      description: `We are looking for a competitive and trustworthy Sales Executive to help us build up our business activities.

Responsibilities:
- Conduct market research to identify selling possibilities and evaluate customer needs
- Actively seek out new sales opportunities through cold calling, networking and social media
- Set up meetings with potential clients and listen to their wishes and concerns
- Prepare and deliver appropriate presentations on products and services
- Create frequent reviews and reports with sales and financial data

Requirements:
- Proven experience as a Sales Executive or relevant role
- Proficiency in English
- Excellent knowledge of MS Office
- Hands-on experience with CRM software is a plus
- Thorough understanding of marketing and negotiating techniques`
    },
    {
      companyId: null,
      title: 'Operations Manager',
      department: 'Operations',
      location: 'Jakarta, Indonesia (On-site)',
      type: 'FULL_TIME',
      status: 'OPEN',
      description: `We are looking for a professional Operations Manager to coordinate and oversee our organization's operations.

Responsibilities:
- Ensure all operations are carried on in an appropriate, cost-effective way
- Improve operational management systems, processes and best practices
- Purchase materials, plan inventory and oversee warehouse efficiency
- Help the organization's processes remain legally compliant
- Formulate strategic and operational objectives
- Examine financial data and use them to improve profitability

Requirements:
- Proven work experience as Operations Manager or similar role
- Knowledge of organizational effectiveness and operations management
- Experience budgeting and forecasting
- Familiarity with business and financial principles
- Excellent communication skills`
    }
  ];

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    job.companyId = companies[i % companies.length].id;
    await prisma.job.create({ data: job });
  }
  console.log('Seeded diverse jobs successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
