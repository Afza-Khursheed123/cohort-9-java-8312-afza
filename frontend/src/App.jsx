import { useState } from "react";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [page, setPage] = useState("home");

  return (
    <ErrorBoundary>
      {page === "register" ? (
        <Registration onBack={() => setPage("home")} />
      ) : (
        <Home onRegister={() => setPage("register")} />
      )}
    </ErrorBoundary>
  );
}

export default App;
