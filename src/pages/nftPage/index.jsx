import { useState, useMemo, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Marketplace from "../../contracts/Marketplace.json";
import {
  useLdo,
  useResource,
  useSubject,
  useSolidAuth,
  deleteResource,
} from "@ldo/solid-react";
import { getSolidDataset } from "@inrupt/solid-client";
import { commitData } from "@ldo/solid";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
import { Header } from "../../components/header";
import { Image } from "antd";
import { v4 } from "uuid";
import dayjs from "dayjs";
import "./style.scss";
import { deleteRecursively } from "../../api/aclControl";
import { QueryEngine } from "@comunica/query-sparql-solid";

function NFTPage() {
  const { session, fetch } = useSolidAuth();
  const { getResource, createData } = useLdo();
  const [data, setData] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const [message, setMessage] = useState("");
  const [currAddress, setCurrAddress] = useState("0x");
  const [fileContainer, setFileContainer] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const ethers = require("ethers");
  const provider = new ethers.BrowserProvider(window.ethereum);
  let { state } = useLocation();

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

  const updateSysPod = async (newDataOwner) => {
    const myEngine = new QueryEngine();
    try {
      await myEngine.queryVoid(
        `
        PREFIX ex: <https://example.com/>
        DELETE {
          ?nft ex:ownedBy ?oldOwner;
               ex:ownedByAddress ?oldOwnerAddress;
               ex:assetURI ?oldAssetUri.
        }
        INSERT {
          ?nft ex:ownedBy "${session.webId}";
               ex:ownedByAddress "${newDataOwner}";
               ex:assetURI "${fileURL}".
        }
        WHERE {
          ?nft ex:ownedBy ?oldOwner;
               ex:ownedByAddress ?oldOwnerAddress;
               ex:assetURI ?oldAssetUri.
        }
        `,
        {
          sources: [state.data.sysPodUri],
          lenient: true,
        }
      );
      console.log("Update execution completed.");
    } catch (error) {
      console.error("Error in update process:", error);
    }
    // const cSysData = changeData(sysNFT, sysResource);
    // cSysData.ownedBy = session.webId;
    // cSysData.ownedByAddress = newDataOwner;
    // cSysData.assetURI = fileURL;
    // if (cSysData.assetTitle) {
    //   delete cSysData.assetTitle;
    // }
    // cSysData.assetTitle = "testData";
    // try {
    //   await commitData(cSysData);
    // } catch (e) {
    //   alert("Error update data:", e);
    // }
  };

  const createNewPod = async (data) => {
    if (!session.webId) return;
    const webIdResource = getResource(session.webId);
    const rootContainerResult = await webIdResource.getRootContainer();
    const mainContainer = rootContainerResult.child("my-solid-app/");

    const file = new File([data.blob], data.fileName, {
      type: data.filetype,
      lastModified: Date.now(),
    });

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
        "Successfully uploaded image to buyer's Solid pod: ",
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

  const deleteOriginalPod = async (delUri) => {
    try {
      const dataset = await getSolidDataset(`${delUri}`, {
        fetch: fetch,
      });
      // delete index.ttl and image in the folder
      deleteRecursively(dataset, {
        fetch: fetch,
      });
    } catch (e) {
      // delete the folder
      try {
        await deleteResource(delUri);
        console.log("delFolder=>", delUri);
      } catch (err) {
        console.log("delFolderError=>", err);
        return;
      }
    }
  };

  const buyNFT = async (data) => {
    console.log("Buying NFT: ", data);
    // 1. 交易，更新 NFT 的 metadata
    // 2. 成功後，刪除原本的 NFT metadata container
    // 同時更新 Marketplace pod 中的 NFT 資料
    // 3. 如失敗，刪除新的 NFT metadata container
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
      const ethPrice = ethers.parseUnits(data.price, "ether");
      console.log("ethPrice", ethPrice);
      let nftTxn = await contract.executeSale(data.tokenId, {
        value: ethPrice,
      });
      await nftTxn.wait();

      createNewPod(data);
      deleteOriginalPod(data.dataUri);
      updateSysPod(signer.address);

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
    const nftIndexUri = dataUri.endsWith("/index.ttl")
      ? dataUri
      : `${dataUri}index.ttl`;
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
      console.log("error: ", nftResource.status.message);
      return <></>;
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
      dataUri,
    };

    return (
      <div className="nft-page">
        <div className="img">
          <Image src={blobUrl} alt={nft.title} />
        </div>
        <div className="nft-info">
          <h1>{nft.title}</h1>
          <div>
            <p className="hint">Token ID </p>
            {contractInfo.tokenId}
          </div>
          <div>
            <p className="hint">Description </p>
            {nft.description}
          </div>
          <div>
            <p className="hint">Price </p>
            {contractInfo.price} ETH
          </div>
          <div>
            <p className="hint">Create Date </p>
            {dayjs(nft.uploadDate).format("YYYY/MM/DD")}
          </div>
          {currAddress !== contractInfo.owner &&
          currAddress !== contractInfo.seller ? (
            <div>
              <p className="hint">Owned by</p>
              {currAddress}
              <button onClick={() => buyNFT(tradeData)}>Buy this NFT</button>
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
        <p className="hint msg">{message}</p>
      </div>
    </div>
  );
}

export default NFTPage;
