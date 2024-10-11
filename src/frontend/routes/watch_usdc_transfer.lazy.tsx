import { Link, createLazyFileRoute } from '@tanstack/react-router'

import { backend } from '../../backend/declarations'
import { useMutation, useQuery } from '@tanstack/react-query'
import Source from '../components/source'

export const Route = createLazyFileRoute('/watch_usdc_transfer')({
  component: Page,
})

function Page() {
  const {
    data: isPollingResult,
  } = useQuery({
    queryKey: ['watch_usdc_transfer_is_polling'],
    queryFn: () => backend.watch_usdc_transfer_is_polling(),
    refetchInterval: 5000,
  })

  const {
    data: pollCountResult,
  } = useQuery({
    queryKey: ['watch_usdc_transfer_poll_count'],
    queryFn: () => backend.watch_usdc_transfer_poll_count(),
    refetchInterval: 5000,
  })

  const {
    data: getResult,
  } = useQuery({
    queryKey: ['watch_usdc_transfer_get'],
    queryFn: () => backend.watch_usdc_transfer_get(),
    refetchInterval: 5000,
  })

  const {
    data: startResult,
    isPending: isFetchingStart,
    mutate: start,
  } = useMutation({
    mutationFn: () => backend.watch_usdc_transfer_start(),
  })

  const {
    data: stopResult,
    isPending: isFetchingStop,
    mutate: stop,
  } = useMutation({
    mutationFn: () => backend.watch_usdc_transfer_stop(),
  })

  const isPolling = isPollingResult && 'Ok' in isPollingResult && isPollingResult.Ok === true;
  const pollCount = pollCountResult && 'Ok' in pollCountResult ? pollCountResult.Ok : 0;

  return (
    <>
      <Link to="/">
        <button> Menu</button>
      </Link>
      <div className="card">
        <p>Watch Base for latest USDC transfers. Pushing the start button will tell the canister to create a poller that gets executed every 10 seconds.</p>

        <p>
          {isPolling ?
            `🟢 Watching for transfers, ${pollCount}/3`
            :
            "🔴 Not watching for transfers"
          }
        </p>

        <button disabled={isFetchingStart} onClick={() => void start()}>
          {isFetchingStart ? 'Requesting…' : 'watch_usdc_transfer_start()'}
        </button>
        {startResult && (
          <pre>{JSON.stringify(startResult, null, 2)}</pre>
        )}

        <button disabled={isFetchingStop} onClick={() => void stop()}>
          {isFetchingStop ? 'Requesting…' : 'watch_usdc_transfer_stop()'}
        </button>
        {stopResult && (
          <pre>{JSON.stringify(stopResult, null, 2)}</pre>
        )}

        <p>Fetched transfer logs, gets reset every time the start button is pushed.</p>

        {getResult && (
          <pre>{JSON.stringify(getResult, null, 2)}</pre>
        )}
        <Source file="watch_usdc_transfer.rs" />
      </div >
    </>
  )
}
