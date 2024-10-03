import { Link, createLazyFileRoute } from "@tanstack/react-router";

import { backend } from "../../backend/declarations";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const Route = createLazyFileRoute("/get_balance")({
  component: Page,
});

function Page() {
  const [ethAddress, setEthAddress] = useState<string>("");

  const {
    data: accountBalanceResult,
    isFetching: isFetchingAccountBalance,
    refetch: refetchAccountBalance,
  } = useQuery({
    queryKey: ["accountBalance", ethAddress],
    queryFn: () => backend.get_balance(ethAddress),
    enabled: false,
  });

  return (
    <>
      <Link to="/">
        <button> Menu</button>
      </Link>
      <div className="card">
        <p>Request the balance of an ETH account.</p>
        <input
          type="text"
          placeholder="ETH address"
          onChange={(e) => setEthAddress(e.target.value)}
          value={ethAddress}
        />
        <button onClick={() => void refetchAccountBalance()}>
          {isFetchingAccountBalance ? "Requesting…" : "get_balance(ethAddress)"}
        </button>
        {accountBalanceResult && (
          <pre>{JSON.stringify(accountBalanceResult, null, 2)}</pre>
        )}
      </div>
    </>
  );
}
