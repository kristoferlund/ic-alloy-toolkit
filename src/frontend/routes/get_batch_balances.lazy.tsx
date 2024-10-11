import { Link, createLazyFileRoute } from "@tanstack/react-router";

import { backend } from "../../backend/declarations";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Source from "../components/source";
import Spinner from "../components/spinner";

export const Route = createLazyFileRoute("/get_batch_balances")({
  component: Page,
});

function Page() {
  const [ethAddress1, setEthAddress1] = useState<string>("");
  const [ethAddress2, setEthAddress2] = useState<string>("");

  const {
    data: accountBalanceResult,
    isFetching: isFetchingAccountBalance,
    refetch: refetchAccountBalance,
  } = useQuery({
    queryKey: ["get_batch_balances", ethAddress1, ethAddress2],
    queryFn: () => backend.get_batch_balances([ethAddress1, ethAddress2]),
    enabled: false,
  });

  return (
    <>
      <Link to="/">
        <button> Menu</button>
      </Link>
      <div className="card">
        <p>
          Request the balances of multiple ETH accounts in one batch. Batch
          requests can contain different types of requests.
        </p>
        <input
          type="text"
          placeholder="ETH address 1"
          onChange={(e) => setEthAddress1(e.target.value)}
          value={ethAddress1}
        />
        <input
          type="text"
          placeholder="ETH address 2"
          onChange={(e) => setEthAddress2(e.target.value)}
          value={ethAddress2}
        />
        <button disabled={isFetchingAccountBalance} onClick={() => void refetchAccountBalance()}>
          {isFetchingAccountBalance
            ? <Spinner /> : "get_batch_balances([address1, address2])"}
        </button>
        {accountBalanceResult && (
          <pre>{JSON.stringify(accountBalanceResult, null, 2)}</pre>
        )}
        <Source file="get_batch_balances.rs" />
      </div>
    </>
  );
}
