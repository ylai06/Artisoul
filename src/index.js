import React, { useState, createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RouterProvider } from "react-router-dom";
import { globalRouters } from "./router";
import { BrowserSolidLdoProvider } from "@ldo/solid-react";
import "bootstrap/dist/css/bootstrap.css";
import "./common/styles/frame.scss";

export const WalletContext = createContext(null);
export const AuthContext = createContext(null);

const AppWrapper = () => {
  const [walletDetails, setWalletDetails] = useState({
    walletAddress: "",
    walletName: "",
    walletBalance: 0,
  });

  const [authSession, setAuthSession] = useState(false);

  return (
    <BrowserSolidLdoProvider>
      <AuthContext.Provider value={{ authSession, setAuthSession }}>
        <WalletContext.Provider value={{ walletDetails, setWalletDetails }}>
          <RouterProvider router={globalRouters}></RouterProvider>
        </WalletContext.Provider>
      </AuthContext.Provider>
    </BrowserSolidLdoProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppWrapper />);
