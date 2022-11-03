import { Poll, PollOption, PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import hasIpVoted from '../../server/queries/hasIpVoted';
import ViewPollResults from '../../widgets/view-poll-results';
import VotePoll from '../../widgets/vote-poll';

type ViewPollProps = {
  poll: Poll & {
    options: PollOption[];
  };
  votingPeriodExpired: boolean;
  ipVoted: boolean;
};

function ViewPoll({ poll, votingPeriodExpired, ipVoted }: ViewPollProps): JSX.Element {
  const [isViewingResults, setIsViewingResults] = useState(votingPeriodExpired && ipVoted);
  const { question } = poll;

  return (
    <div className="grid h-full w-full place-items-center">
      <main className="flex flex-col bg-slate-600 h-[75%] w-[75%] md:w-[50%] rounded-lg px-8 py-4">
        <h1 className="text-white text-4xl text-center">
          {question}
        </h1>
        {
          isViewingResults
            ? (
              <ViewPollResults
                pollId={poll.id}
              />
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
  isNew?: string;
};

export const getServerSideProps: GetServerSideProps<ViewPollProps, UrlParams> = async (ctx) => {
  const { id, isNew } = ctx.query;

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
      include: {
        options: true,
      },
    });

    let votingPeriodExpired = false;
    const pollDurationMinutesInMilliseconds = poll.duration * 60000;
    if (poll.createdAt.getTime() + pollDurationMinutesInMilliseconds < Date.now()) {
      votingPeriodExpired = true;
    }

    const forwarded = ctx.req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string' ? forwarded.split(/, /)[0] : ctx.req.socket.remoteAddress;
    let ipVoted = ip ? await hasIpVoted(prisma, ip, id) : false;

    if (isNew) {
      ipVoted = true;
    }

    return {
      props: {
        poll,
        votingPeriodExpired,
        ipVoted,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
