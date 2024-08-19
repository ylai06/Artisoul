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
import { Header } from "../../components/header";
import { Button, Image } from "antd";
import { v4 } from "uuid";
import dayjs from "dayjs";
import "./style.scss";

function NFTPage() {
  const { session } = useSolidAuth();
  const { getResource, createData, commitData } = useLdo();
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

  const transferNFT = async (data) => {
    if (!session.webId) return;
    const webIdResource = getResource(session.webId);
    const rootContainerResult = await webIdResource.getRootContainer();
    const mainContainer = rootContainerResult.child("my-solid-app/");

    const file = new File([data.blob], data.fileName, {
      type: data.filetype,
      lastModified: Date.now(),
    });
    console.log("file:", file);

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
    let assetUri = "";

    try {
      //upload the file to Buyer's Solid pod
      console.log("Uploading image.. please don't click anything!");
      const response = await newNftContainer.uploadChildAndOverwrite(
        file.name,
        file,
        file.type
      );

      if (response.isError) {
        console.log("Error: " + response.message);
        await newNftContainer.delete();
        return;
      }

      assetUri = response.resource.uri;

      console.log(
        "Uploaded image to your Solid pod success: ",
        response.resource.uri
      );
      setFileURL(response.resource.uri);
      // setUploadImg(response.resource);
    } catch (e) {
      console.log("Error during file upload", e);
    }

    const metadata = newNftContainer.child(`index.ttl`);

    const nft_metadata = createData(NFTShape, metadata.uri, metadata);
    nft_metadata.description = data.description;
    nft_metadata.image = { "@id": assetUri };
    nft_metadata.title = data.title;
    nft_metadata.creator = data.creator;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    nft_metadata.owner = signer.address;
    nft_metadata.uploadDate = new Date().toISOString();

    const result = await commitData(nft_metadata);
    if (result.isError) {
      alert(result.message);
      return;
    }
    console.log(newNftContainer.uri, "; Transfer NFT Metadata: ", result);
    return newNftContainer.uri;
  };

  const buyNFT = async (data) => {
    const uploadDate = new Date().toISOString();
    const newDataUri = transferNFT(data);
    // 1. 交易，更新 NFT 的 metadata
    // 2. 成功後，刪除原本的 NFT metadata container
    // 同時更新 Marketplace pod 中的 NFT 資料
    // 3. 如失敗，刪除新的 NFT metadata container

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
      blob: imageResource.getBlob(),
      filetype: imageResource.getBlob().type,
      imgUri,
    };

    return (
      <div className="nft-page">
        <div className="img">
          <Image src={blobUrl} alt={nft.title} />
        </div>
        <div className="nft-info">
          <h1>{nft.title}</h1>
          <p>
            <p className="hint">Token ID </p>
            {contractInfo.tokenId}
          </p>
          <p>
            <p className="hint">Description </p>
            {nft.description}
          </p>
          <p>
            <p className="hint">Price </p>
            {contractInfo.price} ETH
          </p>
          <p>
            <p className="hint">Create Date </p>
            {dayjs(nft.uploadDate).format("YYYY/MM/DD")}
          </p>
          {currAddress !== contractInfo.owner &&
          currAddress !== contractInfo.seller ? (
            <div>
              <p className="hint">Owned by</p>
              {currAddress}
              <button
                onClick={() => buyNFT(tradeData)}
              >
                Buy this NFT
              </button>
            </div>
          ) : (
            <p className="hint">You are the owner of this NFT</p>
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
      <Header />
      <div className="webpage">
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
    </div>
  );
}

export default NFTPage;
