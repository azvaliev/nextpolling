/* eslint-disable no-nested-ternary */
import { PuffLoader } from 'react-spinners';
import {
  Cell, Legend, Pie, PieChart,
} from 'recharts';
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

  const pollSum = pollResults.reduce((total, result) => total + result.votes, 0);

  return (
    <div className="flex flex-row w-full h-full">
      <div className="w-1/2 ml-0 py-16 pb-24 h-full flex flex-col">
        <h2 className="text-white text-3xl">
          Poll Results
        </h2>
        <ul className="mt-3">
          {pollResults.map((result) => (
            <li>
              {result.option}
              &nbsp;-&gt;&nbsp;
              {result.votes}
              &nbsp;votes
            </li>
          ))}
        </ul>
        <button
          className="btn btn-success mt-auto mb-0"
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(
              window.location.toString().replace(/\?.*/, ''),
            );
          }}

        >
          Share Poll (copy link)
        </button>
      </div>
      <div className="my-auto relative ml-auto mr-0">
        <PieChart width={350} height={350}>
          <Pie
            data={pollResults.map((pollResult) => ({
              x: `${pollResult.option}  - ${(pollResult.votes / pollSum) * 100}%`,
              y: pollResult.votes,
            }))}
            dataKey="y"
            nameKey="x"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={75}
            fill="#3BBEF9"
            label
          >
            {
              pollResults.map((entry, index) => (
                <Cell fill={
                    index === 0
                      ? '#3BBEF9'
                      : index === 1
                        ? '#838EF8'
                        : index === 2
                          ? '#F572B5'
                          : '#1D293A'
                    }
                />
              ))
            }
          </Pie>
          <Legend verticalAlign="top" height={36} />
        </PieChart>
      </div>
    </div>
  );
}

export default ViewPollResults;
