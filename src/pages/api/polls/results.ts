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
    by: ['selectedOptionId'],
    where: {
      pollId,
    },
    _count: {
      selectedOptionId: true,
    },
  });

  const pollOptions = (await prisma.pollOption.findMany({
    where: {
      pollId,
      id: {
        in: pollResults.map((result) => result.selectedOptionId),
      },
    },
    select: {
      value: true,
      id: true,
    },
  })).reduce((allOptions, currentOption) => {
    // eslint-disable-next-line no-param-reassign
    allOptions[currentOption.id] = currentOption.value;
    return allOptions;
  }, {} as Record<string, string>);

  const formattedPollResults = pollResults.map<PollVoteResult>((pollResult) => ({
    option: pollOptions[pollResult.selectedOptionId] || 'N/A',
    // eslint-disable-next-line no-underscore-dangle
    votes: pollResult._count.selectedOptionId,
  }));

  res.status(200).json(formattedPollResults);
}

export default handler;
