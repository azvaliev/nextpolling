import { useEffect, useState } from 'react';
import { PollVoteResult } from '../../pages/api/polls/results';

function usePollResults(pollId: string) {
  const [pollResults, setPollResults] = useState<PollVoteResult[]>();

  useEffect(() => {
    const getPollResultsInterval = setInterval(() => {
      fetch(`/api/polls/results?pollId=${pollId}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((result) => setPollResults(result));
    }, 5000);

    return () => {
      clearInterval(getPollResultsInterval);
    };
  }, [pollId]);

  return pollResults;
}

export default usePollResults;
