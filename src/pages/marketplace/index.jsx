import Marketplace from "../../contracts/Marketplace.json";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useResource, useSubject } from "@ldo/solid-react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
// import { getNFTDetails } from "../../components/getNFTDetails";

const Market = () => {
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
  ];

  const [data, setData] = useState(null);
  const [dataFetched, setFetched] = useState(false);
  const ethers = require("ethers");
  const provider = new ethers.BrowserProvider(window.ethereum);

  const NFTDetails = (tokenURI) => {
    const nftIndexUri = `${tokenURI}index.ttl`;
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
      return { error: nftResource.status.message };
    }

    const imgURL = nft?.image?.["@id"];
    const nftData = {
      name: nft?.title || "Unknown",
      description: nft?.description || "No description",
      image: imgURL,
      blobUrl,
    };

    return nftData;
  };

  async function getAllNFTs() {
    //Pull the deployed contract instance

    const signer = await provider.getSigner();
    let contract = new ethers.Contract(
      Marketplace.address,
      Marketplace.abi,
      signer
    );
    //create an NFT Token
    let transaction = await contract.getAllNFTs();
    console.log("Transaction: ", transaction);
    // Fetch all the details of every NFT from the contract and display

    const items = await Promise.all(
      transaction.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        let price = ethers.formatUnits(i.price.toString(), "ether");
        let data = NFTDetails(tokenURI);
        let item = {
          tokenURI,
          price,
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
        };
        console.log("data", data);
        return item;
      })
    );
    setFetched(true);
    setData(items);
  }

  useEffect(() => {
    if (!dataFetched) {
      getAllNFTs();
    }
  }, [dataFetched]);

  return (
    <div>
      <h1>Marketplace</h1>
      <div>
        {data &&
          data.map((item, index) => (
            <div key={index}>
              <h2>{item.name}</h2>
              <img src={item.image} alt={item.name} />
              <p>{item.description}</p>
              <strong>Token ID: </strong>
              <span>{item.tokenId}</span>
              <br />
              <strong>Seller: </strong>
              <span>{item.seller}</span>
              <br />
              {/* <strong>Owner: </strong>
              <span>{item.owner}</span>
              <br /> */}
              <strong>Price: </strong>
              <span>{item.price} ETH</span>
              <br />
              <strong>Metadata URI: </strong>
              <span>{item.tokenURI}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Market;
