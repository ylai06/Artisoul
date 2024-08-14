import { createBrowserRouter, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../index";
import Login from "../pages/login";
import Home from "../pages/home";
import Account from "../pages/account";
import ErrorPage from "../pages/error";
import MintNFT from "../pages/mintNFT";
import Market from "../pages/marketplace";
import NFTPage from "../pages/nftPage";

const PrivateRoute = ({ element }) => {
  const session = useContext(AuthContext);
  console.log("User session:", session); // 检查 session 状态
  return session.isLoggedIn ? element : <Navigate to="/login" />;
};

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
  // 未匹配，，跳转Login页面
  {
    path: "*",
    element: <Navigate to="/" />,
    errorElement: <ErrorPage />,
  },
]);
