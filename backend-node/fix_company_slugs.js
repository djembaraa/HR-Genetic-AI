const prisma = require('./lib/prisma');

async function main() {
  const companies = await prisma.company.findMany({ where: { slug: "" } });
  for (const company of companies) {
    const baseSlug = company.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.company.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }
    await prisma.company.update({ where: { id: company.id }, data: { slug } });
    console.log(`Fixed: ${company.name} → ${slug}`);
  }
}

main().finally(() => prisma.$disconnect());
