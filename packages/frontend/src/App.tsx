import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "components/auth/AuthProvider";
import { AuthContext } from "contexts/authContext";
import { router } from "main";
import { useContext } from "react";

function InnerApp() {
  const auth = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center h-screen">
      <RouterProvider router={router} context={{ auth: auth ?? undefined }} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}

export default App;
