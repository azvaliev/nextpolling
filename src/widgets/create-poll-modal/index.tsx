import { Poll } from '@prisma/client';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import Modal from '../../components/common/modal';

export const createPollModalId = 'create-poll-modal';

/**
 * Modal that shows create poll prompt and handles submission
 *
 * Usage:
 * ```
 * // Create a label with htmlFor property set to the createPollModalId and class of modal-button
 * // On click, this label will open modal
 * <label
 *   className="btn btn-primary modal-button"
 *   htmlFor={createPollModalId}
 * >
 *   Create a poll
 * </label>
 */
function CreatePollModal(): JSX.Element {
  const [duration, setDuration] = useState<number>(5);
  const router = useRouter();

  const handleSubmitNewPoll = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);

    const reqData: Record<string, string | number> = {};

    formData.forEach((value, key) => {
      if (key === 'duration') {
        reqData[key] = parseInt(value as string, 10);
      } else if (value) {
        reqData[key] = value as string;
      }
    });

    const poll = await fetch('/api/polls/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData),
    });

    const parsedPoll = await poll.json() as Poll;
    router.push(`/polls/${parsedPoll.id}`);
  };

  return (
    <Modal
      id={createPollModalId}
      title="Create Poll"
    >
      <form className="form-control w-full max-w-xs mx-auto gap-3" onSubmit={handleSubmitNewPoll}>
        <div>
          <label className="label flex flex-col" htmlFor="question">
            <span className="label-text text-lg w-full text-left mb-1">
              What&apos;s your poll about?
            </span>
            <input
              type="text"
              placeholder="Enter your question"
              name="question"
              id="question"
              className="input input-bordered w-full max-w-xs text-white"
              required
            />
          </label>
        </div>
        <div>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="label flex flex-col">
            <span className="label-text text-lg w-full text-left mb-1">
              Enter up to four options for answer
            </span>
            <input
              type="text"
              placeholder="Enter an option"
              className="input input-bordered w-full max-w-xs text-white mb-1"
              name="optionOne"
              required
            />
            <input
              type="text"
              placeholder="Enter an option"
              className="input input-bordered w-full max-w-xs text-white mb-1"
              name="optionTwo"
              required
            />
            <input
              type="text"
              placeholder="Enter an option (optional)"
              className="input input-bordered w-full max-w-xs text-white mb-1"
              name="optionThree"
            />
            <input
              type="text"
              placeholder="Enter an option (optional)"
              className="input input-bordered w-full max-w-xs text-white"
              name="optionFour"
            />
          </label>
        </div>
        <div>
          <label className="label" htmlFor="duration">
            <span className="label-text text-lg">
              Pick a duration
            </span>
            <span>
              {duration}
              {' '}
              minutes
            </span>
          </label>
          <input
            type="range"
            min="1"
            max="15"
            className="range"
            name="duration"
            id="duration"
            value={duration}
            onChange={({ target: { value } }) => setDuration(parseInt(value, 10))}
            step="1"
          />
          <div className="w-full flex justify-between text-xs px-2">
            {Array.from({ length: 15 }, (_, idx) => (
              <span key={idx}>|</span>
            ))}
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="btn btn-block btn-outline btn-primary mt-3 hover:!text-white text-md"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreatePollModal;
