import { Button } from "antd";
import { useSolidAuth } from "@ldo/solid-react";
import { Header } from "../../components/header";
import { Link } from "react-router-dom";
import "./home.scss";

function Home() {
  const { session } = useSolidAuth();
  return (
    <div className="P-home">
      <h1>ArtiSoul - A Digital Artwork NFT Marketplace</h1>
      <Header />
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
    </div>
  );
}

export default Home;
