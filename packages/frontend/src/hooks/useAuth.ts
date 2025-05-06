import { AuthContext } from "contexts/authContext";
import { useContext } from "react";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context || !context.sessionId) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return {
    isAuthenticated: context.isAuthenticated,
    login: context.login,
    logout: context.logout,
    sessionId: context.sessionId,
  };
}
