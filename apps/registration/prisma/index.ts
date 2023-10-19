import { PrismaClient } from './client';

const prisma = new PrismaClient();

async function main() {
  for (let classIdx = 1; classIdx <= 10; classIdx++) {
    // Inserting a class
    const newClass = await prisma.class.create({
      data: {
        name: `Class-${classIdx}`,
      },
    });

    // Inserting 10 sessions for each class
    const sessionPromises = Array.from({ length: 10 }, (_, sessionIdx) => {
      return prisma.session.create({
        data: {
          title: `Session-${classIdx}-${sessionIdx + 1}`,
          classId: newClass.id,
        },
      });
    });

    await Promise.all(sessionPromises);
  }

  console.log('Successfully inserted dummy data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Successfully seeded database. Closing connection.');
    await prisma.$disconnect();
  });
