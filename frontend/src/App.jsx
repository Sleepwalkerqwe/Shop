import { useState } from "react";

import "./App.css";
import { Outlet } from "react-router";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Vite + React</h1>
      <Outlet />
    </>
  );
}

export default App;
