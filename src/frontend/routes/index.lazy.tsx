import { Link, createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="menu">
      <Link to="/get_latest_block">
        <button>get_latest_block()</button>
      </Link>
      <Link to="/get_balance">
        <button>get_balance(address)</button>
      </Link>
      <Link to="/get_batch_balances">
        <button>get_batch_balances([address1, address2])</button>
      </Link>
    </div>
  );
}
