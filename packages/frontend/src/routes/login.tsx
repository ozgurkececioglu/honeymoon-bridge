import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "components/button/Button";
import { useAnonymousAuth } from "hooks/useAnonymousAuth";
import { createFullApiUrl } from "../config/env";
import { z } from "zod";

const fallback = "/lobby";

export const Route = createFileRoute("/login")({
  component: Login,
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
});

function Login() {
  const { login } = useAnonymousAuth();
  const navigate = useNavigate({ from: "/login" });

  const handleLogin = async (testUser: number) => {
    try {
      const res = await fetch(createFullApiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "testuser" + testUser,
          password: "password",
        }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const { data } = await res.json();

      if (data.sessionId) {
        login(data.sessionId);

        navigate({ to: "/lobby" });
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="text-center flex flex-col gap-4 items-center justify-center h-screen">
      <h1 className="text-5xl">Honeymoon Bridge</h1>
      <p>Click the button to login as a test user.</p>

      <div className="flex gap-2">
        <Button onClick={() => handleLogin(1)}>login1</Button>
        <Button onClick={() => handleLogin(2)}>login2</Button>
      </div>
    </div>
  );
}
