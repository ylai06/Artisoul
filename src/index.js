import React, { useState, createContext } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { SessionProvider } from "@inrupt/solid-ui-react";
import { globalRouters } from "./router";
import { BrowserSolidLdoProvider } from "@ldo/solid-react";
import "bootstrap/dist/css/bootstrap.css";
import "./common/styles/frame.scss";

export const WalletContext = createContext(null);

const AppWrapper = () => {
  const [walletDetails, setWalletDetails] = useState({
    walletAddress: "",
    walletName: "",
    walletBalance: 0,
  });

  return (
    <BrowserSolidLdoProvider>
      <SessionProvider>
        <WalletContext.Provider value={{ walletDetails, setWalletDetails }}>
          <RouterProvider router={globalRouters}></RouterProvider>
        </WalletContext.Provider>
      </SessionProvider>
    </BrowserSolidLdoProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppWrapper />);
