import { Button, Avatar, Card } from "antd";
import { useSolidAuth } from "@ldo/solid-react";
import { Header } from "../../components/header";
import { Link } from "react-router-dom";
import "./home.scss";

function Home() {
  const { session } = useSolidAuth();
  return (
    <div>
      <Header />
      <div className="P-home webpage">
        {session.isLoggedIn ? (
          <div className="ipt-con">
            <Link to="/mintNFT">
              <Button type="primary">Mint NFT</Button>
            </Link>
            <Link to="/marketplace">
              <Button type="primary">NFT Marketplace</Button>
            </Link>
          </div>
        ) : (
          <></>
        )}
        <div className="panel">
          <div className="intro-txt">
            <h1>Discover digital art & Collect NFTs</h1>
            <p className="text-start">
              Experience the true freedom of trading NFTs where transparency
              meets trust, and creativity flourishes in a user-centric
              ecosystem. Join ArtiSoul NFT and embrace the future of art in the
              digital age.
            </p>
            {session.isLoggedIn ? (
              <Link to="/marketplace">
                <button className="login-btn">NFT Marketplace</button>
              </Link>
            ) : (
              <Link to="/login">
                <button className="login-btn">Get Started</button>
              </Link>
            )}
            <Link to="/login">
              <button className="login-btn">Get Started</button>
            </Link>
          </div>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            className="exampleNFT"
          >
            <div className="title">
              <h4>Space Walking</h4>
            </div>
            <div className="creator">
              <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
              <span className="mt-2">Animakid</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
