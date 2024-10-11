import { Link, createLazyFileRoute } from '@tanstack/react-router'

import { backend } from '../../backend/declarations'
import { useMutation, useQuery } from '@tanstack/react-query'
import Source from '../components/source'
import Spinner from '../components/spinner'

export const Route = createLazyFileRoute('/watch_blocks')({
  component: Page,
})

function Page() {
  const {
    data: isPollingResult,
  } = useQuery({
    queryKey: ['watch_blocks_is_polling'],
    queryFn: () => backend.watch_blocks_is_polling(),
    refetchInterval: 5000,
  })

  const {
    data: pollCountResult,
  } = useQuery({
    queryKey: ['watch_blocks_poll_count'],
    queryFn: () => backend.watch_blocks_poll_count(),
    refetchInterval: 5000,
  })

  const {
    data: getResult,
  } = useQuery({
    queryKey: ['watch_blocks_get'],
    queryFn: () => backend.watch_blocks_get(),
    refetchInterval: 5000,
  })

  const {
    data: startResult,
    isPending: isFetchingStart,
    mutate: start,
  } = useMutation({
    mutationFn: () => backend.watch_blocks_start(),
  })

  const {
    data: stopResult,
    isPending: isFetchingStop,
    mutate: stop,
  } = useMutation({
    mutationFn: () => backend.watch_blocks_stop(),
  })

  const isPolling = isPollingResult && 'Ok' in isPollingResult && isPollingResult.Ok === true;
  const pollCount = pollCountResult && 'Ok' in pollCountResult ? pollCountResult.Ok : 0;

  return (
    <>
      <Link to="/">
        <button> Menu</button>
      </Link>
      <div className="card">
        <p>Watch the EVM for the latest block numbers. Pushing the start button will tell the canister to create a poller that gets executed every 10 seconds.</p>

        <p>
          {isPolling ?
            `🟢 Watching for blocks, ${pollCount}/10`
            :
            "🔴 Not watching for blocks"
          }
        </p>

        <button disabled={isFetchingStart} onClick={() => void start()}>
          {isFetchingStart ? <Spinner /> : 'watch_blocks_start()'}
        </button>
        {startResult && (
          <pre>{JSON.stringify(startResult, null, 2)}</pre>
        )}

        <button disabled={isFetchingStop} onClick={() => void stop()}>
          {isFetchingStop ? <Spinner /> : 'watch_blocks_stop()'}
        </button>
        {stopResult && (
          <pre>{JSON.stringify(stopResult, null, 2)}</pre>
        )}

        <p>Fetched block numbers, gets reset every time the start button is pushed.</p>

        {getResult && (
          <pre>{JSON.stringify(getResult, null, 2)}</pre>
        )}
        <Source file="watch_blocks.rs" />
      </div >
    </>
  )
}
