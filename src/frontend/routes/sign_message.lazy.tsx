import { Link, createLazyFileRoute } from '@tanstack/react-router'

import { backend } from '../../backend/declarations'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Source from '../components/source'
import Spinner from '../components/spinner'

export const Route = createLazyFileRoute('/sign_message')({
  component: Page,
})

function Page() {
  const [message, setMessage] = useState<string>('')

  const {
    data: signatureResult,
    isFetching: isFetchingSignature,
    refetch: refetchSignature,
  } = useQuery({
    queryKey: ['signature', message],
    queryFn: () => backend.sign_message(message),
    enabled: false,
  })

  return (
    <>
      <Link to="/">
        <button> Menu</button>
      </Link>
      <div className="card">
        <p>Let the backend canister sign a message.</p>
        <input
          type="text"
          placeholder="Message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button onClick={() => void refetchSignature()}>
          {isFetchingSignature ? <Spinner /> : 'sign_message(message)'}
        </button>
        {signatureResult && (
          <pre>{JSON.stringify(signatureResult, null, 2)}</pre>
        )}
        <Source file='sign_message.rs' />
      </div>
    </>
  )
}
