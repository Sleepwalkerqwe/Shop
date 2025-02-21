import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./routers/router.jsx";
import "remixicon/fonts/remixicon.css";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
