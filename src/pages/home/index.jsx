import { Button } from "antd";
import { useSolidAuth } from "@ldo/solid-react";
import { Header } from "../../components/header";
import { Link } from "react-router-dom";
import "./home.scss";

function Home() {
  return (
    <div className="P-home">
      <h1>ArtiSoul - A Digital Artwork NFT Marketplace</h1>
      <Header />
      <div className="ipt-con">
        <Link to="/mintNFT">
          <Button type="primary">Mint NFT</Button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
