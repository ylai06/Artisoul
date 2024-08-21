import React, { useContext, useState } from "react";
import { useResource, useSolidAuth, useSubject } from "@ldo/solid-react";
import { SolidProfileShapeShapeType } from "../../.ldo/solidProfile.shapeTypes";
import { Link } from "react-router-dom";
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
    <div className="hero-anime">
      <div className="navigation-wrap bg-light start-header start-style">
        <div className="">
          <div className="row">
            <div className="col-12">
              <nav className="navbar navbar-expand-md navbar-light">
                <Link className="navbar-brand" to="/">
                  ArtiSoul
                </Link>
                <div
                  className="collapse navbar-collapse justify-content-end"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav ml-auto py-4 py-md-0">
                    {/* <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4 active">
                      <a
                        className="nav-link dropdown-toggle"
                        data-toggle="dropdown"
                        href="/"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Home
                      </a>
                      <div className="dropdown-menu">
                        <a className="dropdown-item" href="#">
                          Action
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                        <a className="dropdown-item" href="#">
                          Something else here
                        </a>
                        <a className="dropdown-item" href="#">
                          Another action
                        </a>
                      </div>
                    </li> */}
                    <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                      <Link className="nav-link" to="/">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                      <Link className="nav-link" to="/marketplace">
                        Marketplace
                      </Link>
                    </li>
                    <li className="nav-item pl-4 pl-md-0 ml-0 ml- md-4">
                      <Link className="nav-link" to="/mintNFT">
                        Mint NFT
                      </Link>
                    </li>
                    <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                      <Link className="nav-link" to="/myNFT">
                        My NFT
                      </Link>
                    </li>
                    {session.isLoggedIn ? (
                      <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                        <Link className="nav-link" to="/account">
                          {loggedInName}
                        </Link>
                      </li>
                    ) : (
                      <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
                        <Link to="/login" className="nav-link">
                          <span>Log In</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
