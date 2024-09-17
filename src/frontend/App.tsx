import "./App.css";

import alloyLogo from "./assets/alloy.png";
import { backend } from "../backend/declarations";
import icLogo from "./assets/ic.svg";
import { useQuery } from "@tanstack/react-query";

function App() {
  const {
    data: latestBlockResult,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["latestBlock"],
    queryFn: () => backend.get_latest_block(),
    enabled: false,
  });

  console.log(latestBlockResult);
  console.log(isFetching);

  return (
    <>
      <div>
        <a href="https://alloy.rs" target="_blank">
          <img src={alloyLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={icLogo} className="logo" alt="React logo" />
        </a>
      </div>
      <h1>Alloy + ICP</h1>
      <div className="card">
        <p>Request the latest block from Eth Sepolia.</p>
        <button onClick={() => refetch()}>
          {isFetching ? "Requesting…" : "get_latest_block()"}
        </button>
        {latestBlockResult && (
          <pre>{JSON.stringify(latestBlockResult, null, 2)}</pre>
        )}
      </div>
    </>
  );
}

export default App;
