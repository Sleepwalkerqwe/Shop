import { createBrowserRouter } from "react-router";
import App from "../App";
import Home from "../pages/home/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <div>Home Page</div>,
      },
    ],
  },
]);

export default router;
