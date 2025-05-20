const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Création des utilisateurs
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob',
    },
  })

  // Création d'une conversation
  const conversation = await prisma.conversation.create({
    data: {
      name: 'Conversation Test',
      participants: {
        create: [
          { userId: user1.id },
          { userId: user2.id },
        ],
      },
      messages: {
        create: [
          {
            content: 'Bonjour !',
            userId: user1.id,
          },
          {
            content: 'Salut ! Comment vas-tu ?',
            userId: user2.id,
          },
        ],
      },
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 