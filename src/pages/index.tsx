import Head from 'next/head';
import { createPollModalId } from '../widgets/create-poll-modal';

function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Next Polling</title>
        <meta name="description" content="Easy, simple polling app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="hero min-h-screen">
        <div className="hero-content text-center flex-col">
          <h1 className="text-5xl font-bold text-white pb-4">
            Welcome to Next Polling
          </h1>
          <div>
            <h2 className="text-3xl font-medium pb-4">
              Would you like to...
            </h2>
            <div className="flex flex-row gap-4">
              {/* control is in _app, safe to disable */}
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label
                className="btn btn-primary modal-button text-lg"
                htmlFor={createPollModalId}
              >
                Create a poll
              </label>
              <a className="btn btn-outline text-lg" href="TODO: open search poll modal">
                Vote in a poll
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
