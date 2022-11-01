import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

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
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

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
    .map(([_k, v]) => v as string);

  const prisma = new PrismaClient();
  const poll = await prisma.poll.create({
    data: {
      question: parsedData.question,
      duration: parsedData.duration,
      options: {
        createMany: {
          data: options.map((value) => ({
            value,
          })),
        },
      },
    },
  });

  res.status(200).json(poll);
}

export default handler;
