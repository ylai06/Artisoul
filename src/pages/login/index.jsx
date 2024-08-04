import { Button, Input, message, theme } from "antd";
import React, { useState } from "react";
import { useSolidAuth } from "@ldo/solid-react";
import { Link } from "react-router-dom";
import "./login.scss";

function Login() {
  const { session } = useSolidAuth();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const nextStep = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const steps = [
    {
      title: "Login with your Solid Pod",
      img: "",
      content: (
        <p>
          Welcome! You can login your account by authorized with your Solid POD
          using your webId. If you don't have one, learn how to get started at{" "}
          <a
            className="solid-link"
            href="https://solidproject.org/"
            target="_blank"
          >
            solidproject.org
          </a>
          ."
        </p>
      ),
      btn: "Login",
    },
    {
      title: "Next Steps",
      img: "",
      content: (
        <div>
          ✨ Connect your wallet, create your NFT, and dive into the exciting
          world of digital art. Whether you're an artist, a collector, or just
          curious, there's a place for you in the NFT community.
        </div>
      ),
      btnCnt: (
        <div className="wallet-option">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
            alt=""
            className="icon-wallet"
          />
          Metamask
        </div>
      ),
    },
    {
      title: "Welcome! Now you can...",
      img: "",
      content: (
        <div>
          <h4>🚀 Create Your Own NFT</h4>
          <h4>🛒 Sell Your NFTs</h4>
          <h4>🎨 Collect NFTs</h4>
        </div>
      ),
      btn: <Link to="/marketplace">Marketplace</Link>,
    },
  ];
  return (
    <div className="p-login">
      {session.isLoggedIn ? (
        <Link to="/marketplace">
          <button className="login-btn">NFT Marketplace</button>
        </Link>
      ) : (
        <div>
          <div className="d-flex">
            <div className="img-box"></div>
            <div className="ms-5 d-flex flex-column justify-content-center align-items-center">
              <div className="login-txt">
                <h1>{steps[current].title}</h1>
                <p className="text-start">{steps[current].content}</p>
              </div>
              {steps[current].btn ? (
                <div className="d-flex login-id">
                  <button className="login-btn">{steps[current].btn}</button>
                </div>
              ) : (
                steps[current].btnCnt
              )}
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
                onClick={() => message.success("Processing complete!")}
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
      )}
      {/* <div className="img-box"></div>
      <div>
        <div className="login-txt">
          <h1>Login with your Solid Pod</h1>
          <p className="text-start">
            Welcome! You can connect to your Solid POD using your webId and
            start creating, collecting and selling NFTs. If you don't have one,
            learn how to get started at{" "}
            <a
              className="solid-link"
              href="https://solidproject.org/"
              target="_blank"
            >
              solidproject.org
            </a>
            .
          </p>
        </div>
        {session.isLoggedIn ? (
          <Link to="/marketplace">
            <button className="login-btn">NFT Marketplace</button>
          </Link>
        ) : (
          <div className="d-flex login-id">
            <Input className="web-id" placeholder="Enter your webId" />
            <Link to="/login">
              <button className="login-btn ms-2">Log in</button>
            </Link>
          </div>
        )}
      </div> */}
    </div>
  );
}

export default Login;
