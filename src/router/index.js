import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/login";
import Home from "../pages/home";
import Account from "../pages/account";
import ErrorPage from "../pages/error";
import MintNFT from "../pages/mintNFT";
import Marketplace from "../pages/marketplace";

export const globalRouters = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/mintNFT",
    element: <MintNFT />,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
  },
  {
    path: "/",
    element: <Home />,
  },
  // 未匹配，，跳转Login页面
  {
    path: "*",
    element: <Navigate to="/" />,
    errorElement: <ErrorPage />,
  },
]);
