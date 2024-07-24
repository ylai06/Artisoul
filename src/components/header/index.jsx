import React, { useContext, useState } from "react";
import { useResource, useSolidAuth, useSubject } from "@ldo/solid-react";
import { SolidProfileShapeShapeType } from "../../.ldo/solidProfile.shapeTypes";
import { Button } from "antd";
import { ethers } from "ethers";
import { WalletContext } from "../../index";

export const Header = () => {
  const { session, login, logout } = useSolidAuth();
  const { walletDetails, setWalletDetails } = useContext(WalletContext);
  const [connected, setConnected] = useState(false);
  const webIdResource = useResource(session.webId);
  const profile = useSubject(SolidProfileShapeShapeType, session.webId);

  const loggedInName = webIdResource?.isReading()
    ? "LOADING..."
    : profile?.fn
      ? profile.fn
      : session.webId;

  // Function to connect/disconnect the wallet
  async function connectWallet() {
    if (!connected) {
      // Connect the wallet using ethers.js
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const _walletAddress = await signer.getAddress();
      const weiBalance = await provider.getBalance(_walletAddress);
      const _walletBalance = ethers.formatEther(weiBalance);
      setConnected(true);
      setWalletDetails({
        walletAddress: _walletAddress,
        walletBalance: _walletBalance,
      });
    } else {
      // Disconnect the wallet
      // window.ethereum = null;
      localStorage.removeItem("provider");
      sessionStorage.removeItem("provider");
      setConnected(false);
      setWalletDetails({
        walletAddress: "",
        walletBalance: 0,
      });
    }
  }

  return (
    <header>
      {session.isLoggedIn ? (
        // Is the session is logged in
        <div>
          <div>
            <p>You are logged as {loggedInName}. </p>
            <p>Your webId is {session.webId}.</p>
            <Button onClick={logout}>Log Out Solid</Button>
          </div>
          <div>
            {!connected ? (
              <div>
                <p>Next, please connect your metaMask to trade NFT</p>
                <Button onClick={connectWallet}>Connect</Button>
              </div>
            ) : (
              <div>
                <p>Account Address: {walletDetails.walletAddress}</p>
                <p>Account Balance: {walletDetails.walletBalance} ETH</p>
                <Button onClick={connectWallet}>Disconnect Wallet</Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        // If the session is not logged in
        <div>
          You are not Logged In{" "}
          <Button
            onClick={() => {
              // Get the Solid issuer the user should log into
              const issuer = prompt(
                "Enter your Solid Issuer",
                "https://solidweb.me"
                // "https://login.inrupt.com"
              );
              if (!issuer) return;
              login(issuer);
            }}
          >
            Log In
          </Button>
        </div>
      )}
      <hr />
    </header>
  );
};
