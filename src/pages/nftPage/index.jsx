import { useState, useMemo, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Marketplace from "../../contracts/Marketplace.json";
import {
  useLdo,
  useResource,
  useSubject,
  useSolidAuth,
} from "@ldo/solid-react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
import { Button } from "antd";
import { v4 } from "uuid";
import "./style.scss";

function NFTPage() {
  const { session } = useSolidAuth();
  const { getResource } = useLdo();
  const [data, setData] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const [message, setMessage] = useState("");
  const [currAddress, setCurrAddress] = useState("0x");
  const [fileContainer, setFileContainer] = useState(null);
  const [fileURL, setFileURL] = useState(null);
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

  const transferNFT = async () => {
    if (!session.webId) return;
    const webIdResource = getResource(session.webId);
    const rootContainerResult = await webIdResource.getRootContainer();
    const mainContainer = rootContainerResult.child("my-solid-app/");

    // Create the main container if it doesn't exist yet
    await mainContainer.createIfAbsent();

    const newNFTContainer = await mainContainer.createChildAndOverwrite(
      `${v4()}/`
    );

    if (newNFTContainer.isError) {
      alert(newNFTContainer.message);
      return;
    }

    const newNftContainer = newNFTContainer.resource;
    setFileContainer(newNftContainer);

    // try {
    //   //upload the file to Buyer's Solid pod
    //   console.log("Uploading image.. please don't click anything!");
    //   const response = await newNftContainer.uploadChildAndOverwrite(
    //     file.name,
    //     file,
    //     file.type
    //   );

    //   if (response.isError) {
    //     console.log("Error: " + response.message);
    //     await newNftContainer.delete();
    //     return;
    //   }

    //   console.log(
    //     "Uploaded image to your Solid pod success: ",
    //     response.resource.uri
    //   );
    //   setFileURL(response.resource.uri);
    //   // setUploadImg(response.resource);
    // } catch (e) {
    //   console.log("Error during file upload", e);
    // }
  };

  const buyNFT = async (tradeData) => {
    const uploadDate = new Date().toISOString();
    console.log("tradeData: ", tradeData);
    // try {
    //   const ethers = require("ethers");
    //   const provider = new ethers.BrowserProvider(window.ethereum);
    //   const signer = await provider.getSigner();
    //   let contract = new ethers.Contract(
    //     Marketplace.address,
    //     Marketplace.abi,
    //     signer
    //   );
    //   console.log("contract: ", contract);

    //   setMessage("Buying NFT..., please wait up to 5 minutes.");

    //   const ethPrice = ethers.parseUnits(tradeData.price, "ether");

    //   console.log("ethPrice", ethPrice);

    //   let nftTxn = await contract.executeSale(tradeData.tokenId, {
    //     value: ethPrice,
    //   });
    //   await nftTxn.wait();

    //   console.log("contract details: ", nftTxn);
    //   setMessage(
    //     `You successfully bought the NFT! Check it out at: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
    //   );
    // } catch (e) {
    //   console.error("Error buying NFT: ", e);
    //   setMessage("Error buying NFT, ", e);
    // }
  };

  const MetaInfo = ({ dataUri, contractInfo, currAddress }) => {
    const nftIndexUri = `${dataUri}index.ttl`;
    const nftResource = useResource(nftIndexUri);
    const nft = useSubject(NFTShape, nftIndexUri);
    const imageResource = useResource(nft?.image?.["@id"]);
    const imgUri = imageResource.uri;

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
      title: nft.title,
      description: nft.description,
      creator: nft.creator,
      fileName: imgUri.substring(imgUri.lastIndexOf("/") + 1),
      fileType: imageResource.getBlob().type,
      imgUri,
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
