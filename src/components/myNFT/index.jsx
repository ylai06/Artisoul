import Marketplace from "../../contracts/Marketplace.json";
import { useLdo, useResource, useSubject } from "@ldo/solid-react";
import { useState, useContext, useMemo } from "react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
import { WalletContext } from "../../index";
import { Link } from "react-router-dom";
import { NFTTile } from "../card";
import "./style.scss";

// function NFTTile(data) {
//   const nftIndexUri = `${data.dataUri}index.ttl`;
//   const nftResource = useResource(nftIndexUri);
//   const nft = useSubject(NFTShape, nftIndexUri);
//   const { getResource } = useLdo();
//   const { walletDetails } = useContext(WalletContext);
//   const imageResource = useResource(nft?.image?.["@id"]);

//   const PodUrl = "";
//   const blobUrl = useMemo(() => {
//     if (imageResource && imageResource.isBinary()) {
//       return URL.createObjectURL(imageResource.getBlob());
//     }
//     return undefined;
//   }, [imageResource]);

//   if (nftResource.status.isError) {
//     return <p>nftResource.status.message</p>;
//   }

//   // const newTo = {
//   //   pathname: "/nftPage/" + nft.title,
//   // };
//   const newTo = nft?.image?.["@id"];

//   return (
//     <Link to={newTo} target="_blank">
//       <div className="container">
//         <img src={blobUrl} alt="" className="image" crossOrigin="anonymous" />
//       </div>
//       <div className="text-container">
//         <strong className="title">{nft.title}</strong>
//         <p>owner: {nft.owner}</p>
//         <p className="description">{nft.description}</p>
//       </div>
//     </Link>
//   );
// }

export const MyNFT = ({ mainContainer }) => {
  const sampleData = [
    {
      name: "NFT#1",
      description: "Alchemy's First NFT",
      website: "http://axieinfinity.io",
      image:
        "https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
      price: "0.03ETH",
      currentlySelling: "True",
      address: "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
      name: "NFT#2",
      description: "Alchemy's Second NFT",
      website: "http://axieinfinity.io",
      image:
        "https://gateway.pinata.cloud/ipfs/QmdhoL9K8my2vi3fej97foiqGmJ389SMs55oC5EdkrxF2M",
      price: "0.03ETH",
      currentlySelling: "True",
      address: "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
      name: "NFT#3",
      description: "Alchemy's Third NFT",
      website: "http://axieinfinity.io",
      image:
        "https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
      price: "0.03ETH",
      currentlySelling: "True",
      address: "0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
  ];

  const [data, updateData] = useState(sampleData);
  const [dataFetched, updateFetched] = useState(false);

  async function getAllNFTs() {
    // const ethers = require("ethers");
    // //After adding your Hardhat network to your metamask, this code will get providers and signers
    // const provider = new ethers.BrowserProvider(window.ethereum);
    // const signer = provider.getSigner();
    // //Pull the deployed contract instance
    // let contract = new ethers.Contract(
    //   Marketplace.address,
    //   Marketplace.abi,
    //   signer
    // );
    // //create an NFT Token
    // let transaction = await contract.getAllNFTs();
    //Fetch all the details of every NFT from the contract and display
    // const items = await Promise.all(
    //   transaction.map(async (i) => {
    //     var tokenURI = await contract.tokenURI(i.tokenId);
    //     console.log("getting this tokenUri", tokenURI);
    //     tokenURI = GetIpfsUrlFromPinata(tokenURI);
    //     let meta = await axios.get(tokenURI);
    //     meta = meta.data;
    //     let price = ethers.utils.formatUnits(i.price.toString(), "ether");
    //     let item = {
    //       price,
    //       tokenId: i.tokenId.toNumber(),
    //       seller: i.seller,
    //       owner: i.owner,
    //       image: meta.image,
    //       name: meta.name,
    //       description: meta.description,
    //     };
    //     return item;
    //   })
    // );
    // updateFetched(true);
    // updateData(items);
  }

  if (!dataFetched) getAllNFTs();

  return (
    <div className="marketplace-container">
      <h2>My NFTs</h2>
      <div className="nft-box">
        {mainContainer
          // Get all the children of the main container
          ?.children()
          // Filter out children that aren't containers themselves
          .filter((child) => child.type === "container")
          // Render a "Post" for each child
          .map((child) => (
            <NFTTile dataUri={child.uri} key={child.uri} />
          ))}
      </div>
    </div>
  );
};
