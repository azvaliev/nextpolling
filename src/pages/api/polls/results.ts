import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const expectedBody = z.object({
  pollId: z.string(),
});

export type PollVoteResult = {
  option: string;
  votes: number;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const parsedQuery = expectedBody.safeParse(req.query);
  if (!parsedQuery.success) {
    res.status(400).end();
    return;
  }

  const { pollId } = parsedQuery.data;
  const prisma = new PrismaClient();

  const pollResults = await prisma.vote.groupBy({
    by: ['selectedOption'],
    where: {
      pollId,
    },
    _count: {
      selectedOption: true,
    },
  });

  const formattedPollResults = pollResults.map<PollVoteResult>((pollResult) => ({
    option: pollResult.selectedOption,
    // eslint-disable-next-line no-underscore-dangle
    votes: pollResult._count.selectedOption,
  }));

  res.status(200).json(formattedPollResults);
}

export default handler;
