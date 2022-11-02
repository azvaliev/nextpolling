import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import hasIpVoted from '../../../server/queries/hasIpVoted';

export const config = {
  api: {
    bodyParser: true,
  },
};

const expectedInput = z.object({
  selectedOptionId: z.string(),
  pollId: z.string(),
});

async function handler(req: NextApiRequest, res: NextApiResponse<{ success: boolean }>) {
  if (!req.method?.toUpperCase().startsWith('P')) {
    res.status(405).json({
      success: false,
    });
    return;
  }
  const castVoteInputValid = expectedInput.safeParse(req.body);

  if (!castVoteInputValid.success) {
    res.status(400).json({
      success: false,
    });
    return;
  }

  const { data: { pollId, selectedOptionId } } = castVoteInputValid;
  const prisma = new PrismaClient();

  const pollTimestampData = await prisma.poll.findUnique({
    where: {
      id: pollId,
    },
    select: {
      createdAt: true,
      duration: true,
    },
  });

  if (!pollTimestampData) {
    res.status(404).json({
      success: false,
    });
    return;
  }

  const durationMinutesInMilliseconds = 60000 * pollTimestampData.duration;
  if (pollTimestampData.createdAt.getTime() + durationMinutesInMilliseconds < Date.now()) {
    res.status(400).json({
      success: false,
    });
    return;
  }

  const forwarded = req.headers['x-forwarded-for'] as string;
  const ip = forwarded
    ? forwarded.split(/, /)[0]
    : req.socket.remoteAddress;

  const ipAlreadyVoted = ip ? await hasIpVoted(prisma, ip, pollId) : false;

  if (ipAlreadyVoted) {
    res.status(400).json({
      success: false,
    });
    return;
  }

  await prisma.vote.create({
    data: {
      pollId,
      selectedOptionId,
      ip,
    },
  });

  res.status(200).json({
    success: true,
  });

  await prisma.$disconnect();
}

export default handler;
