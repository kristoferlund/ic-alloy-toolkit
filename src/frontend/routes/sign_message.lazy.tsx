import { Link, createLazyFileRoute } from '@tanstack/react-router'

import { backend } from '../../backend/declarations'
import { useState } from 'react'
import Source from '../components/source'
import Spinner from '../components/spinner'
import { useMutation } from '@tanstack/react-query'

export const Route = createLazyFileRoute('/sign_message')({
  component: Page,
})

function Page() {
  const [message, setMessage] = useState<string>('')

  const {
    data: signatureResult,
    isPending: isFetchingSignature,
    mutate: sign
  } = useMutation({
    mutationFn: () => backend.sign_message(message),
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
        <button disabled={isFetchingSignature} onClick={() => void sign()}>
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
