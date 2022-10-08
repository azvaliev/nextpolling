import { PrismaClient } from '@prisma/client';

async function hasIpVoted(prisma: PrismaClient, ip: string): Promise<boolean> {
  const result = await prisma.vote.count({
    where: {
      ip,
    },
  });

  return !!result;
}

export default hasIpVoted;
