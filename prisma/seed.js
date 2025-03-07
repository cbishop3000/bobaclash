import prisma from '../lib/prisma';

async function main() {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
    },
  });

  await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'janesmith@example.com',
    },
  });

  console.log('Seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
