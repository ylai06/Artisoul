import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  handleIncomingRedirect,
  getDefaultSession,
} from "@inrupt/solid-client-authn-browser";
import { WalletContext } from "../../index";
import { ethers } from "ethers";
import { message } from "antd";
import "../login/login.scss";

function Callback() {
  const [connected, setConnected] = useState(false); // connect to wallet
  const navigate = useNavigate();
  const { walletDetails, setWalletDetails } = useContext(WalletContext);
  const [messageApi, contextHolder] = message.useMessage();
  const errorMsg = (msg) => {
    messageApi.open({
      type: "error",
      content: msg,
    });
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      errorMsg("Please install MetaMask first.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const _walletAddress = await signer.getAddress();
      const weiBalance = await provider.getBalance(_walletAddress);
      const _walletBalance = ethers.formatEther(weiBalance);
      setWalletDetails({
        walletAddress: _walletAddress,
        walletBalance: _walletBalance,
      });
      setConnected(true);
    } catch (error) {
      errorMsg("Connect wallet failed! " + error.reason);
    }
  };

  useEffect(() => {
    async function completeLogin() {
      const res = await handleIncomingRedirect();
      if (!res.isLoggedIn) {
        window.location.href = "/login";
      }
    }
    completeLogin();
    console.log("complete Login Solid pod");
  }, []);

  useEffect(() => {
    console.log("Connect wallet?");
    if (connected) {
      console.log("Process completed successfully");
      console.log("Redirecting to login page...");
      setWalletDetails({
        ...walletDetails,
        walletLogin: true,
      });
      navigate("/#/login");
    }
  }, [connected]);

  return (
    <div className="p-login">
      {contextHolder}
      <div>
        <div className="d-flex">
          <div className="img-box">
            <img
              src={require("../../img/nft/pinkalpaca.png")}
              alt="nft example"
            />
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="login-txt">
              <h1>Next Steps</h1>
              <div className="text-start">
                <div>
                  ✨ Connect your wallet, create your NFT, and dive into the
                  exciting world of digital art. Whether you're an artist, a
                  collector, or just curious, there's a place for you in the NFT
                  community.
                </div>
              </div>
            </div>
            <div className="wallet-option" onClick={connectWallet}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                alt="MetaMask"
                className="icon-wallet"
              />
              Metamask
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Callback;
