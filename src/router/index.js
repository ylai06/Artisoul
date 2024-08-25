import { createHashRouter, Navigate } from "react-router-dom";
import Login from "../pages/login";
import Home from "../pages/home";
import Account from "../pages/account";
import MintNFT from "../pages/mintNFT";
import Market from "../pages/marketplace";
import NFTPage from "../pages/nftPage";
import UserNFT from "../pages/userNFT";

// const basename = process.env.NODE_ENV === 'production' ? "/Artisoul" : process.env.PUBLIC_URL;

export const globalRouters = createHashRouter(
  [
    {
      path: "/home",
      element: <Navigate to="/" />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
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
      path: "*",
      element: <Navigate to="/" />,
    },
  ]
);
