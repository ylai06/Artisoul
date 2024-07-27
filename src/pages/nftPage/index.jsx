import { useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import Marketplace from "../../contracts/Marketplace.json";
import { useLdo, useResource, useSubject } from "@ldo/solid-react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
import "./style.scss";

const MetaInfo = ({ dataUri, contractInfo }) => {
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
          <strong>Seller: </strong>
          {contractInfo.seller}
        </p>
        <p>
          <strong>Owner: </strong>
          {nft.owner}
        </p>
        <p>
          <strong>Price: </strong>
          {contractInfo.price} ETH
        </p>
        <p>
          <strong>Create Date: </strong>
          {nft.uploadDate}
        </p>
      </div>
    </div>
  );
};

function NFTPage(props) {
  const [data, setData] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const [message, setMessage] = useState("");
  const [currAddress, setCurrAddress] = useState("0x");
  const ethers = require("ethers");
  const provider = new ethers.BrowserProvider(window.ethereum);

  async function getNFTData(tokenId) {
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
  }

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
        <MetaInfo dataUri={data.metaDataUri} contractInfo={data} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default NFTPage;
