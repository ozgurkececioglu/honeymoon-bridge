import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/game/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Go back to <Link to="/lobby">lobby</Link>
    </div>
  );
}
