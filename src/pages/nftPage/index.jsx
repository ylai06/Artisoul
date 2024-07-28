import { useState, useMemo, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Marketplace from "../../contracts/Marketplace.json";
import { useLdo, useResource, useSubject } from "@ldo/solid-react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
import { Button } from "antd";
import "./style.scss";

function NFTPage() {
  const [data, setData] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const [message, setMessage] = useState("");
  const [currAddress, setCurrAddress] = useState("0x");
  const ethers = require("ethers");
  const provider = new ethers.BrowserProvider(window.ethereum);

  const getNFTData = async (tokenId) => {
    const signer = await provider.getSigner();
    // Get the signer's address
    const addr = await signer.getAddress();

    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      Marketplace.address,
      Marketplace.abi,
      signer
    );

    // Get the NFT Token and Metadata URI
    var metaDataUri = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedTokenForId(tokenId);
    const nftPriceInEther = ethers.formatUnits(listedToken.price, "ether");

    let item = {
      metaDataUri,
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      price: nftPriceInEther,
    };
    setData(item);
    setDataFetched(true);
    setCurrAddress(addr);
  };

  const buyNFT = async (tradeData) => {
    try {
      const ethers = require("ethers");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      let contract = new ethers.Contract(
        Marketplace.address,
        Marketplace.abi,
        signer
      );
      console.log("contract: ", contract);

      setMessage("Buying NFT..., please wait up to 5 minutes.");

      const ethPrice = ethers.parseUnits(tradeData.price, "ether");

      console.log("ethPrice", ethPrice);

      let nftTxn = await contract.executeSale(tradeData.tokenId, {
        value: ethPrice,
      });
      await nftTxn.wait();

      console.log("contract details: ", nftTxn);
      setMessage(
        `You successfully bought the NFT! Check it out at: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
      );
    } catch (e) {
      console.error("Error buying NFT: ", e);
      setMessage("Error buying NFT, ", e);
    }
  };

  const MetaInfo = ({ dataUri, contractInfo, currAddress }) => {
    const nftIndexUri = `${dataUri}index.ttl`;
    const nftResource = useResource(nftIndexUri);
    const nft = useSubject(NFTShape, nftIndexUri);
    const imageResource = useResource(nft?.image?.["@id"]);

    const blobUrl = useMemo(() => {
      if (imageResource && imageResource.isBinary()) {
        return URL.createObjectURL(imageResource.getBlob());
      }
      return undefined;
    }, [imageResource]);

    if (nftResource.status.isError) {
      return <p>nftResource.status.message</p>;
    }

    const tradeData = {
      price: contractInfo.price,
      tokenId: contractInfo.tokenId,
    };

    return (
      <div className="nft-page">
        <div className="img">
          <img src={blobUrl} alt="" />
        </div>
        <div className="nft-info">
          <h2>{nft.title}</h2>
          <p>
            <strong>Token ID: </strong>
            {contractInfo.tokenId}
          </p>
          <p>
            <strong>Description: </strong>
            {nft.description}
          </p>
          <p>
            <strong>Price: </strong>
            {contractInfo.price} ETH
          </p>
          <p>
            <strong>Create Date: </strong>
            {nft.uploadDate}
          </p>
          {currAddress !== contractInfo.owner &&
          currAddress !== contractInfo.seller ? (
            <Button type="primary" onClick={() => buyNFT(tradeData)}>
              Buy this NFT
            </Button>
          ) : (
            <p>You are the owner of this NFT</p>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {}, [message]);

  const params = useParams();
  const tokenId = params.id;
  console.log("Token ID: ", tokenId);
  if (!tokenId) {
    setMessage("No token ID provided");
  }
  if (!dataFetched) getNFTData(tokenId);

  return (
    <div>
      <h1>NFT Page</h1>
      {dataFetched ? (
        <MetaInfo
          dataUri={data.metaDataUri}
          contractInfo={data}
          currAddress={currAddress}
        />
      ) : (
        <p>Loading...</p>
      )}
      <p>{message}</p>
    </div>
  );
}

export default NFTPage;
