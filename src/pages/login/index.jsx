import { Button, Input, message, theme } from "antd";
import React, { useContext, useEffect, useState } from "react";
import {
  login,
  getDefaultSession,
  handleIncomingRedirect,
} from "@inrupt/solid-client-authn-browser";
import { getWacUri, getWacRuleWithAclUri } from "@ldo/solid";
import {
  getSolidDatasetWithAcl,
  getPublicAccess,
  setPublicDefaultAccess,
  setPublicResourceAccess,
  createAcl,
  getAgentAccess,
  setAgentResourceAccess,
  setAgentDefaultAccess,
  saveAclFor,
  hasResourceAcl,
  hasFallbackAcl,
  hasAccessibleAcl,
  createAclFromFallbackAcl,
  getResourceAcl,
  getSolidDataset,
} from "@inrupt/solid-client";
import { setWacRuleForAclUriWithOri } from "../../wac/setWacRule";
import { Link, Navigate } from "react-router-dom";
import { ethers } from "ethers";
import { WalletContext } from "../../index";
import "./login.scss";

const Checkbox = ({ label, value, onChange }) => {
  return (
    <label style={{ display: "block" }}>
      <input
        type="checkbox"
        checked={value}
        onChange={onChange}
        className="aclCheck"
      />
      {label}
    </label>
  );
};

function Login() {
  const [connected, setConnected] = useState(false); // connect to wallet
  const { walletDetails, setWalletDetails } = useContext(WalletContext);
  const [current, setCurrent] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [ACL, setACL] = React.useState({
    read: false,
    write: false,
    append: false,
    control: false,
    origin: "",
  });

  const errorMsg = (msg) => {
    messageApi.open({
      type: "error",
      content: msg,
    });
  };

  const successMsg = (msg) => {
    messageApi.open({
      type: "success",
      content: msg,
    });
  };

  const nextStep = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
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
      setConnected(!connected);
    } catch (error) {
      errorMsg("Connect wallet failed! " + error.reason);
    }

    // const provider = new ethers.BrowserProvider(window.ethereum);
    // if (!connected) {
    //   // Connect the wallet using ethers.js
    //   const signer = await provider.getSigner();
    //   const _walletAddress = await signer.getAddress();
    //   const weiBalance = await provider.getBalance(_walletAddress);
    //   const _walletBalance = ethers.formatEther(weiBalance);
    //   setWalletDetails({
    //     walletAddress: _walletAddress,
    //     walletBalance: _walletBalance,
    //   });
    //   setConnected(true);
    // } else {
    //   console.log("disconnectWallet");
    //   // Disconnect the wallet
    //   const account = await provider.send("eth_requestAccounts", []);
    //   if (account.length > 0) {
    // messageApi.info(
    //   `To fully disconnect account:${account}, please open MetaMask, click on the connected site indicator, and select "Disconnect".`
    // );
    //   } else {
    //     setConnected(false);
    //     setWalletDetails({
    //       walletAddress: "",
    //       walletBalance: 0,
    //     });
    //   }
    // }
  };

  const steps = [
    {
      title: "Login with your WebId",
      img: require("../../img/nft/jellyfish.png"),
      content: (
        <span>
          👋 Please login to your account by authorized with your Solid POD
          using your webId. If you don't have one, learn how to get started at{" "}
          <a
            className="solid-link"
            href="https://solidproject.org/"
            target="_blank"
          >
            solidproject.org
          </a>
          .
        </span>
      ),
      btnCnt: (
        <div className="pod-div">
          <input
            type="text"
            id="url"
            defaultValue="https://solidweb.me"
            size="50"
            className="pod-url"
          />
          <button
            onClick={async (e) => {
              e.preventDefault();
              const issuer = document.getElementById("url").value;
              const url = new URL(window.location.href);
              // 提取出基礎的路徑和查詢字符串的問號 '?'
              const baseUrl = `${url.origin}${url.pathname}`;
              if (!issuer) return;
              if (!getDefaultSession().info.isLoggedIn) {
                try {
                  // 假設 login 是一個異步函數
                  await login({
                    oidcIssuer: issuer,
                    redirectUrl: baseUrl,
                    clientName: "Artisoul",
                  });
                } catch (error) {
                  errorMsg("Login failed!");
                }
              }
            }}
          >
            <img
              src="https://solidproject.org/image/logo.svg"
              alt="MetaMask"
              className="me-2 pod-logo"
            />
            Connect
          </button>
        </div>
      ),
    },
    {
      title: "Next Steps",
      img: require("../../img/nft/pinkalpaca.png"),
      content: (
        <div>
          ✨ Connect your wallet, create your NFT, and dive into the exciting
          world of digital art. Whether you're an artist, a collector, or just
          curious, there's a place for you in the NFT community.
        </div>
      ),
      btnCnt: (
        <div className="wallet-option" onClick={connectWallet}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
            alt="MetaMask"
            className="icon-wallet"
          />
          Metamask
        </div>
      ),
    },
    {
      title: "Welcome! Now you can...",
      img: require("../../img/nft/avocado.png"),
      content: (
        <div>
          <h4>🚀 Create Your Own NFT</h4>
          <h4>🛒 Sell Your NFTs</h4>
          <h4>🎨 Collect NFTs</h4>
        </div>
      ),
      btn: (
        <Link to="/">
          <button className="login-btn">Home</button>
        </Link>
      ),
    },
  ];

  const podUri =
    "https://solidweb.me/NFT-asset/my-solid-app/47d9896a-9f26-4c6a-812f-6f2e6c379b2b/";

  const userSetACL = async () => {
    const acl = {
      read: ACL.read,
      write: ACL.write,
      append: ACL.append,
      control: ACL.control,
    };
    console.log("aclRule=>", acl, ACL.origin);

    const res = await getWacUri(podUri);
    if (!res.isError) {
      console.log("wacUri=>", res.wacUri);
    }

    const aclUri = res.wacUri;

    // const res1 = await getWacRuleWithAclUri(res.wacUri, { fetch: fetch });
    // if (!res1.isError) {
    //   console.log("wacRule=>", res1);
    // }

    const containerUrl = podUri;
    const datasetWithAcl = await getSolidDatasetWithAcl(containerUrl, {
      fetch: fetch,
    });
    console.log("datasetWithAcl=>", datasetWithAcl);
    // const publicAccess = getPublicAccess(datasetWithAcl);
    // console.log("public Access=>", publicAccess);

    // let resourceAcl = getResourceAcl(datasetWithAcl);
    // console.log("resourceAcl ori=>", resourceAcl);
    // if (!resourceAcl) {
    //   resourceAcl = createAcl(datasetWithAcl);
    //   console.log("resourceAcl new=>", resourceAcl);
    // }
    // const updatedAcl = setPublicResourceAccess(resourceAcl, {
    //   read: true,
    //   append: false,
    //   write: false,
    //   control: false,
    // });
    // console.log("updatedAcl=>", updatedAcl);
    // await saveAclFor(datasetWithAcl, updatedAcl, { fetch: fetch });

    // const agentAccess = getAgentAccess(datasetWithAcl);
    // const agentWebId = "https://solidweb.me/test-access1/profile/card#me";
    // console.log("agent Access=>", agentAccess);
    // const updatedAcl = setAgentResourceAccess(resourceAcl, agentWebId, {
    //   read: true,
    //   append: true,
    //   write: true,
    //   control: true,
    // });
    // console.log("updatedAcl=>", updatedAcl);
    // await saveAclFor(datasetWithAcl, updatedAcl, { fetch: fetch });

    const aclAccess = await setWacRuleForAclUriWithOri(
      aclUri, // /.acl
      {
        // public: {
        //   read: ACL.read,
        //   append: ACL.append,
        //   write: ACL.write,
        //   control: ACL.control,
        // },
        authenticated: {
          read: true,
          append: true,
          write: true,
          control: true,
        },
      },
      podUri,
      ACL.origin,
      { fetch: fetch }
    );
    console.log("aclAccess=>", aclAccess);

    const publicAccess = getPublicAccess(datasetWithAcl);
    console.log("public Access=>", publicAccess);

    let resourceAcl = getResourceAcl(datasetWithAcl);
    console.log("resourceAcl ori=>", resourceAcl);
  };

  async function completeLogin() {
    console.log("Completing login process");
    await handleIncomingRedirect();
  }

  useEffect(() => {
    completeLogin();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    if (current === 0) {
      if (code && state) {
        setCurrent(1); // 在登录流程完成后设置状态
      }
    }
  }, []);

  useEffect(() => {
    if (connected) {
      console.log("Connect wallet process completed successfully");
      setTimeout(() => {
        setCurrent(2);
      }, 3 * 1000);
    }
  }, [connected]);

  return (
    <div className="p-login">
      {contextHolder}
      <div>
        <div className="d-flex">
          <div className="img-box">
            <img src={steps[current].img} alt="nft example" />
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="login-txt">
              <h1>{steps[current].title}</h1>
              <div className="text-start">{steps[current].content}</div>
            </div>
            {steps[current].btn || steps[current].btnCnt}
          </div>
        </div>
        <div
          style={{
            marginTop: 24,
          }}
        >
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => nextStep()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => successMsg("Processing complete!")}
            >
              Done
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
        </div>
      </div>
      {/* <div className="test">
        <div className="testACL">
          <h2>Set ACL access and origin</h2>
          <form id="aclForm">
            <Checkbox
              label="Read"
              value={ACL.read}
              onChange={() => setACL({ ...ACL, read: !ACL.read })}
            />
            <Checkbox
              label="Write"
              value={ACL.write}
              onChange={() => setACL({ ...ACL, write: !ACL.write })}
            />
            <Checkbox
              label="Append"
              value={ACL.append}
              onChange={() => setACL({ ...ACL, append: !ACL.append })}
            />
            <Checkbox
              label="Control"
              value={ACL.control}
              onChange={() => setACL({ ...ACL, control: !ACL.control })}
            />

            <div>
              <label for="origin">ACL Origin:</label>
              <Input
                type="text"
                id="origin"
                name="origin"
                placeholder="Enter ACL origin"
                value={setACL.origin}
                onChange={(e) => setACL({ ...ACL, origin: e.target.value })}
              />
            </div>

            <div className="btn-box">
              <Button
                id="setAclBtn"
                onClick={() => {
                  userSetACL();
                }}
              >
                Submit
              </Button>
              <Button id="getAclBtn">View ACL file</Button>
            </div>
          </form>
        </div>
      </div> */}
    </div>
  );
}

export default Login;
