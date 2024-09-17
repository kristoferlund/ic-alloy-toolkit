import "./App.css";

import alloyLogo from "./assets/alloy.png";
import { backend } from "../backend/declarations";
import icLogo from "./assets/ic.svg";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function App() {
  const [ethAddress, setEthAddress] = useState<string>("");

  const {
    data: latestBlockResult,
    isFetching: isFetchingBlock,
    refetch: refetchBlock,
  } = useQuery({
    queryKey: ["latestBlock"],
    queryFn: () => backend.get_latest_block(),
    enabled: false,
  });

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
      <div>
        <a href="https://alloy.rs" target="_blank">
          <img src={alloyLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://internetcomputer.org" target="_blank">
          <img src={icLogo} className="logo" alt="React logo" />
        </a>
      </div>
      <h1>Alloy + ICP</h1>
      <div className="card">
        <p>Request the latest block from Eth Sepolia.</p>
        <button onClick={() => refetchBlock()}>
          {isFetchingBlock ? "Requesting…" : "get_latest_block()"}
        </button>
        {latestBlockResult && (
          <pre>{JSON.stringify(latestBlockResult, null, 2)}</pre>
        )}
      </div>
      <div className="card">
        <p>Request the balance of an ETH account.</p>
        <input
          type="text"
          placeholder="ETH address"
          onChange={(e) => setEthAddress(e.target.value)}
          value={ethAddress}
        />
        <button onClick={() => refetchAccountBalance()}>
          {isFetchingAccountBalance ? "Requesting…" : "get_balance(ethAddress)"}
        </button>
        {accountBalanceResult && (
          <pre>{JSON.stringify(accountBalanceResult, null, 2)}</pre>
        )}
      </div>
    </>
  );
}

export default App;
