import Marketplace from "../../contracts/Marketplace.json";
import { useState, useEffect, useMemo, useCallback } from "react";
import { NFTCard } from "../../components/card";

const Market = () => {
  const [data, setData] = useState(null);
  const [dataFetched, setFetched] = useState(false);
  const ethers = require("ethers");
  const provider = new ethers.BrowserProvider(window.ethereum);

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
        // let data = NFTDetails(tokenURI);
        let item = {
          tokenURI,
          price,
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
        };
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
          data.map((item, index) => {
            return (
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
                <NFTCard dataUri={item.tokenURI} token={item.tokenId}/>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Market;
