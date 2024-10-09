import { Link, createLazyFileRoute } from '@tanstack/react-router'

import { backend } from '../../backend/declarations'
import { useQuery } from '@tanstack/react-query'
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
    refetchInterval: 1000,
  })

  const {
    data: pollCountResult,
  } = useQuery({
    queryKey: ['watch_usdc_transfer_poll_count'],
    queryFn: () => backend.watch_usdc_transfer_poll_count(),
    refetchInterval: 1000,
  })

  const {
    data: getResult,
  } = useQuery({
    queryKey: ['watch_usdc_transfer_get'],
    queryFn: () => backend.watch_usdc_transfer_get(),
    refetchInterval: 1000,
  })

  const {
    data: startResult,
    isFetching: isFetchingStart,
    refetch: refetchStart,
  } = useQuery({
    queryKey: ['watch_usds_transfer_start'],
    queryFn: () => backend.watch_usdc_transfer_start(),
    enabled: false
  })

  const {
    data: stopResult,
    isFetching: isFetchingStop,
    refetch: refetchStop,
  } = useQuery({
    queryKey: ['watch_usdc_transfer_stop'],
    queryFn: () => backend.watch_usdc_transfer_stop(),
    enabled: false
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

        <button onClick={() => void refetchStart()}>
          {isFetchingStart ? 'Requesting…' : 'watch_usdc_transfer_start()'}
        </button>
        {startResult && (
          <pre>{JSON.stringify(startResult, null, 2)}</pre>
        )}

        <button onClick={() => void refetchStop()}>
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
