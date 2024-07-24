import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RouterProvider } from "react-router-dom";
import { globalRouters } from "./router";
import { BrowserSolidLdoProvider } from "@ldo/solid-react";

export const WalletContext = React.createContext(null);

const AppWrapper = () => {
  const [walletDetails, setWalletDetails] = useState({
    walletAddress: "",
    walletName: "",
    walletBalance: 0,
  });
  return (
    <BrowserSolidLdoProvider>
      <WalletContext.Provider value={{ walletDetails, setWalletDetails }}>
        <RouterProvider router={globalRouters} />
      </WalletContext.Provider>
    </BrowserSolidLdoProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppWrapper />);
