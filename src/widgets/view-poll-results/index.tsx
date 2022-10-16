import { PuffLoader } from 'react-spinners';
import usePollResults from './usePollResults';

type ViewPollResultsProps = {
  pollId: string;
};

function ViewPollResults({ pollId }: ViewPollResultsProps): JSX.Element {
  const pollResults = usePollResults(pollId);

  if (!pollResults) {
    return (
      <PuffLoader className="m-auto" size={100} color="#3abff8" loading />
    );
  }

  return (
    <div>
      <pre>
        {JSON.stringify(pollResults, undefined, 2)}
      </pre>
    </div>
  );
}

export default ViewPollResults;
