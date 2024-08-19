import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/login";
import Home from "../pages/home";
import Account from "../pages/account";
import ErrorPage from "../pages/error";
import MintNFT from "../pages/mintNFT";
import Market from "../pages/marketplace";
import NFTPage from "../pages/nftPage";
import UserNFT from "../pages/userNFT";

const basename = process.env.PUBLIC_URL || "/";

export const globalRouters = createBrowserRouter(
  [
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
      path: "/myNFT",
      element: <UserNFT />,
    },
    {
      path: "/marketplace",
      element: <Market />,
    },
    {
      path: "/viewNFT/:id",
      element: <NFTPage />,
    },
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace/>,
    },
  ],
  { basename }
);
