import { useContext } from "react";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Home from "../pages/home";
import Account from "../pages/account";
import MintNFT from "../pages/mintNFT";
import Market from "../pages/marketplace";
import NFTPage from "../pages/nftPage";
import UserNFT from "../pages/userNFT";
import Callback from "../pages/callback"; // 处理回调的组件
import { WalletContext } from "../index";

export function RouterSwitcher() {
  const { walletDetails } = useContext(WalletContext);
  console.log("walletDetails in router:", walletDetails);

  const basename = process.env.NODE_ENV === "development" ? "/" : "/Artisoul";
  console.log("basename in router:", basename);

  const isCallbackRoute =
    process.env.NODE_ENV === "development"
      ? window.location.pathname.startsWith("/callback")
      : window.location.pathname.startsWith("/Artisoul/callback");

  console.log(
    "isCallbackRoute in router:",
    isCallbackRoute,
    !walletDetails.walletLogin
  );

  if (isCallbackRoute && !walletDetails.walletLogin) {
    return (
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/mintNFT" element={<MintNFT />} />
        <Route path="/myNFT" element={<UserNFT />} />
        <Route path="/marketplace" element={<Market />} />
        <Route path="/viewNFT/:id" element={<NFTPage />} />
      </Routes>
    </HashRouter>
  );
}
