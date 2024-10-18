import { Link, createLazyFileRoute } from '@tanstack/react-router'

import { backend } from '../../backend/declarations'
import { useMutation, useQuery } from '@tanstack/react-query'
import Source from '../components/source'
import Spinner from '../components/spinner'

export const Route = createLazyFileRoute('/send_eth')({
  component: Page,
})

function Page() {
  const { data: accountBalanceResult, isFetching: isFetchingAccountBalance } =
    useQuery({
      queryKey: ['accountBalance'],
      queryFn: () => backend.get_balance([]),
    })

  const accountBalance =
    accountBalanceResult && 'Ok' in accountBalanceResult
      ? accountBalanceResult.Ok
      : undefined

  const {
    data: txResult,
    isPending: isSendingTx,
    mutate: sendTx,
  } = useMutation({
    mutationFn: () => backend.send_eth(),
  })

  return (
    <>
      <Link to="/">
        <button> Menu</button>
      </Link>
      <div className="card">
        <p>
          Send 100 wei from the canister eth address to, for the purposes of
          this demo, back to the canister eth address.
        </p>
        <p>
          <i>
            If call fails due to lack of funds, top up the canister eth address
            with some SepoliaEth.
          </i>
        </p>
        <p>
          <i>
            Instead of using Alloy fillers for nonce handling, the <code>send_eth</code> function
            implements that manually instead to minimize the number of requests
            sent to the RPC.
          </i>
        </p>
        <p>
          <i>
            This canister call can take up to a minute to complete, please be
            patient.
          </i>
        </p>

        <p>
          Canister ETH balance:{' '}
          {isFetchingAccountBalance ? <Spinner /> : <b>{accountBalance} wei</b>}
        </p>
        <button disabled={isSendingTx} onClick={() => void sendTx()}>
          {isSendingTx ? <Spinner /> : 'send_eth()'}
        </button>
        {txResult && <pre>{JSON.stringify(txResult, null, 2)}</pre>}
        <Source file="send_eth.rs" />
      </div>
    </>
  )
}
