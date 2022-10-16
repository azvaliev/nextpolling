import { PrismaClient } from '@prisma/client';

async function hasIpVoted(prisma: PrismaClient, ip: string, pollId: string): Promise<boolean> {
  const result = await prisma.vote.count({
    where: {
      ip,
      pollId,
    },
  });

  return !!result;
}

export default hasIpVoted;
