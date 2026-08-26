const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  try {
    const email = "djembararafattt@gmail.com";
    const password = "Djembara123";
    const companyName = "Djembara";
    const name = "Djembar Arafat";

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) { console.log("Email already exists!"); return; }

    const baseSlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.company.findUnique({ where: { slug } })) {
      slug = baseSlug + "-" + counter;
      counter++;
    }
    console.log("Slug:", slug);

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.$transaction(async (tx) => {
      const newCompany = await tx.company.create({ data: { name: companyName, slug } });
      console.log("Company created:", newCompany.id);
      const newUser = await tx.user.create({ data: { email, password: hashedPassword, role: "ADMIN", companyId: newCompany.id } });
      return newUser;
    });
    
    console.log("SUCCESS! userId:", user.id);
  } catch (error) {
    console.error("ERROR TYPE:", error.constructor.name);
    console.error("ERROR:", error.message);
    if (error.meta) console.error("META:", JSON.stringify(error.meta));
  } finally {
    await prisma.$disconnect();
  }
}

main();
