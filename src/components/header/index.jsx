import React, { useContext, useState } from "react";
import { useResource, useSolidAuth, useSubject } from "@ldo/solid-react";
import { SolidProfileShapeShapeType } from "../../.ldo/solidProfile.shapeTypes";
import { Button } from "antd";
import { ethers } from "ethers";
import { WalletContext } from "../../index";
import "./header.scss";

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
    <body className="hero-anime">
      <div class="navigation-wrap bg-light start-header start-style">
        <div class="">
          <div class="row">
            <div class="col-12">
              <nav class="navbar navbar-expand-md navbar-light">
                <a class="navbar-brand" href="#" target="_blank">
                  {/* <img src="https://assets.codepen.io/1462889/fcy.png" alt="" /> */}
                  ArtiSoul
                </a>
                <button
                  class="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span class="navbar-toggler-icon"></span>
                </button>

                <div
                  class="collapse navbar-collapse justify-content-end"
                  id="navbarSupportedContent"
                >
                  <ul class="navbar-nav ml-auto py-4 py-md-0">
                    <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4 active">
                      <a
                        class="nav-link dropdown-toggle"
                        data-toggle="dropdown"
                        href="#"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Home
                      </a>
                      <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">
                          Action
                        </a>
                        <a class="dropdown-item" href="#">
                          Another action
                        </a>
                        <a class="dropdown-item" href="#">
                          Something else here
                        </a>
                        <a class="dropdown-item" href="#">
                          Another action
                        </a>
                      </div>
                    </li>
                    <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                      <a class="nav-link" href="/marketplace">
                        Marketplace
                      </a>
                    </li>
                    <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                      <a class="nav-link" href="/mintNFT">
                        Mint NFT
                      </a>
                    </li>
                    <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                      <a class="nav-link" href="/mintNFT">
                        Sell NFT
                      </a>
                    </li>
                    {session.isLoggedIn ? (
                      <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                        <a class="nav-link" href="#">
                          {loggedInName}
                        </a>
                      </li>
                    ) : (
                      <li class="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                        <span
                          class="nav-link"
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
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* <a href="https://front.codes/" class="logo" target="_blank">
        <img src="https://assets.codepen.io/1462889/fcy.png" alt="" />
      </a> */}

      {/* {session.isLoggedIn ? (
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
      <hr /> */}
    </body>
  );
};
