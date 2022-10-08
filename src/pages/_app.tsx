import '../styles/globals.css';
import dynamic from 'next/dynamic';
import { AppProps } from 'next/app';

const CreatePollModal = dynamic(
  () => import('../widgets/create-poll-modal'),
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <CreatePollModal />
    </>
  );
}

export default MyApp;
