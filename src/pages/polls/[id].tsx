import { Poll, PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import VotePoll from '../../widgets/vote-poll';

type ViewPollProps = {
  poll: Poll;
  votingPeriodExpired: boolean;
};

function ViewPoll({ poll, votingPeriodExpired }: ViewPollProps): JSX.Element {
  const [isViewingResults, setIsViewingResults] = useState(votingPeriodExpired);
  const { question } = poll;

  return (
    <div className="grid h-full w-full place-items-center">
      <main className="flex flex-col bg-slate-600 h-[75%] w-[50%] rounded-lg px-8 py-4">
        <h1 className="text-white text-4xl text-center">
          {question}
        </h1>
        {
        isViewingResults
          ? (
            undefined
          ) : (
            <VotePoll
              poll={poll}
              onVoteSubmitted={() => setIsViewingResults(true)}
              onViewResultsWithoutVoting={() => setIsViewingResults(true)}
            />
          )
        }
      </main>
    </div>
  );
}

export default ViewPoll;

type UrlParams = {
  id: string;
};

export const getServerSideProps: GetServerSideProps<ViewPollProps, UrlParams> = async (ctx) => {
  const { id } = ctx.query;

  if (typeof id !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    const prisma = new PrismaClient();
    const poll = await prisma.poll.findUniqueOrThrow({
      where: {
        id,
      },
    });

    let votingPeriodExpired = false;
    if (poll.createdAt.getTime() + poll.duration > Date.now()) {
      votingPeriodExpired = true;
    }

    return {
      props: {
        poll,
        votingPeriodExpired,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
