import { Link, createLazyFileRoute } from '@tanstack/react-router'

import { backend } from '../../backend/declarations'
import { useQuery } from '@tanstack/react-query'
import Source from '../components/source'

export const Route = createLazyFileRoute('/watch_blocks')({
  component: Page,
})

function Page() {
  const {
    data: isPollingResult,
  } = useQuery({
    queryKey: ['watch_blocks_is_polling'],
    queryFn: () => backend.watch_blocks_is_polling(),
    refetchInterval: 1000,
  })

  const {
    data: getResult,
  } = useQuery({
    queryKey: ['watch_blocks_get'],
    queryFn: () => backend.watch_blocks_get(),
    refetchInterval: 1000,
  })

  const {
    data: startResult,
    isFetching: isFetchingStart,
    refetch: refetchStart,
  } = useQuery({
    queryKey: ['watch_blocks_start'],
    queryFn: () => backend.watch_blocks_start(),
    enabled: false
  })

  const {
    data: stopResult,
    isFetching: isFetchingStop,
    refetch: refetchStop,
  } = useQuery({
    queryKey: ['watch_blocks_stop'],
    queryFn: () => backend.watch_blocks_stop(),
    enabled: false
  })

  const isPolling = isPollingResult && 'Ok' in isPollingResult && isPollingResult.Ok === true;

  return (
    <>
      <Link to="/">
        <button> Menu</button>
      </Link>
      <div className="card">
        <p>Watch block</p>

        <p>
          {isPolling ?
            "🟢 Watching for blocks"
            :
            "🔴 Not watching for blocks"
          }
        </p>

        <button onClick={() => void refetchStart()}>
          {isFetchingStart ? 'Requesting…' : 'watch_blocks_start()'}
        </button>
        {startResult && (
          <pre>{JSON.stringify(startResult, null, 2)}</pre>
        )}

        <button onClick={() => void refetchStop()}>
          {isFetchingStop ? 'Requesting…' : 'watch_blocks_stop()'}
        </button>
        {stopResult && (
          <pre>{JSON.stringify(stopResult, null, 2)}</pre>
        )}

        {getResult && (
          <pre>{JSON.stringify(getResult, null, 2)}</pre>
        )}
        <Source file="get_latest_block.rs" />
      </div >
    </>
  )
}
