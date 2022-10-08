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
  selectedOption: z.string(),
  pollId: z.string(),
});

async function handler(req: NextApiRequest, res: NextApiResponse<{ success: boolean }>) {
  if (!req.method?.toUpperCase().startsWith('P')) {
    res.status(405).end();
    return;
  }
  const castVoteInputValid = expectedInput.safeParse(req.query);

  if (!castVoteInputValid.success) {
    res.status(400).end();
    return;
  }

  const { data: { pollId, selectedOption } } = castVoteInputValid;

  const forwarded = req.headers['x-forwarded-for'] as string;
  const ip = forwarded
    ? forwarded.split(/, /)[0]
    : req.socket.remoteAddress;

  const prisma = new PrismaClient();

  const ipAlreadyVoted = ip ? hasIpVoted(prisma, ip) : false;

  if (ipAlreadyVoted) {
    res.status(400).json({
      success: false,
    });
    return;
  }

  await prisma.vote.create({
    data: {
      pollId,
      selectedOption,
      ip,
    },
  });

  res.status(200).json({
    success: true,
  });
}

export default handler;
