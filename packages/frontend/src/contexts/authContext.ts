import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (sessionId: string) => Promise<void>;
  logout: () => Promise<void>;
  sessionId: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);
