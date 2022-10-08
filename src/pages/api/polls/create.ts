import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

// Using Formidable
export const config = {
  api: {
    bodyParser: true,
  },
};

const expectedInput = z.object({
  question: z.string(),
  optionOne: z.string(),
  optionTwo: z.string(),
  optionThree: z.string().optional(),
  optionFour: z.string().optional(),
  duration: z.number(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let parsedData: ReturnType<typeof expectedInput['parse']>;
  const {
    question, optionOne, optionTwo, optionThree, optionFour, duration,
  } = req.body;

  try {
    parsedData = expectedInput.parse({
      question,
      optionOne,
      optionTwo,
      optionThree,
      optionFour,
      duration,
    });
  } catch {
    res.status(400).end();
    return;
  }

  if (!parsedData.optionThree) {
    delete parsedData.optionThree;
  }
  if (!parsedData.optionFour) {
    delete parsedData.optionFour;
  }

  const options = Object.entries(parsedData)
    .filter(([k]) => k.includes('option'))
    .map(([_k, v]) => v);

  const prisma = new PrismaClient();
  const poll = await prisma.poll.create({
    data: {
      question: parsedData.question,
      options,
      duration: parsedData.duration,
    },
  });

  res.status(200).json(poll);
}

export default handler;
