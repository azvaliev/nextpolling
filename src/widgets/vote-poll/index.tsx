import { FormEvent, useState } from 'react';
import { Poll } from '@prisma/client';

type VotePollProps = {
  className?: string;
  poll: Poll;
  onVoteSubmitted: (votedOption: string) => void;
  onViewResultsWithoutVoting: () => void;
};

function VotePoll({
  poll,
  onVoteSubmitted,
  onViewResultsWithoutVoting,
  className = '',
}: VotePollProps) {
  const options = poll.options as string[];

  const [selectedOption, setSelectedOption] = useState<typeof options[number]>();

  const handleSubmitPoll = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOption) {
      // TODO: Show error
      return;
    }
    // TODO - Fetch API to submit
    onVoteSubmitted(selectedOption);
  };

  return (
    <form className={`flex flex-col flex-1 ${className}`} onSubmit={handleSubmitPoll}>
      <div className="my-auto">
        <h2 className="text-lg mb-2">
          Select any option and press submit to cast your vote
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {options.map((option) => (
            <label
              htmlFor={option}
              className={`
                   btn btn-lg btn-primary btn-outline !text-white border-primary relative
                   ${selectedOption === option && 'btn-active'}
                  `}
            >
              <input
                type="radio"
                key={option}
                onClick={() => setSelectedOption(option)}
                value={option}
                id={option}
                className="appearance-none w-full h-full opacity-[0.001] z-50 absolute hover:cursor-pointer"
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-secondary btn-block btn-lg text-2xl text-white"
      >
        Submit
      </button>
      <button
        type="button"
        className="btn btn-accent btn-block btn-lg btn-outline text-2xl hover:!text-white mt-2"
        onClick={onViewResultsWithoutVoting}
      >
        View Results Without Voting
      </button>
    </form>
  );
}

export default VotePoll;
