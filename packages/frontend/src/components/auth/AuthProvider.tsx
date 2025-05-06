import { AuthContext } from "contexts/authContext";
import { ReactNode, useCallback, useState } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const isAuthenticated = !!sessionId;

  const logout = useCallback(async () => {
    setSessionId(null);
  }, []);

  const login = useCallback(async (sessionId: string) => {
    setSessionId(sessionId);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, sessionId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
