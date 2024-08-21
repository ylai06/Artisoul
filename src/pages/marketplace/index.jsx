import { useState, useEffect, useMemo, useCallback } from "react";
import { QueryEngine } from "@comunica/query-sparql-solid";
import Marketplace from "../../contracts/Marketplace.json";
import { Header } from "../../components/header";
import { NFTCard } from "../../components/card";
import { SearchOutlined } from "@ant-design/icons";
import "./market.scss";
import { useResource } from "@ldo/solid-react";
import { NFTsShapeType } from "../../.ldo/sysData.shapeTypes";

const Market = () => {
  const [data, setData] = useState(null);
  const [dataFetched, setFetched] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const ethers = require("ethers");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const searchResult = document.getElementById("searchResult");
  const [pointerPods, setPointerPods] = useState([]);
  const resource = useResource(
    "https://solidweb.me/NFTsystem/my-solid-app/NFTList/"
  );

  async function getPodUri(respods) {
    let podList = [];
    if (respods != []) {
      const myEngine = new QueryEngine();
      const bindingsStream = await myEngine.queryBindings(
        `
        PREFIX ldo: <https://ldo.js.org/>
        SELECT ?nft ?assetURI
        WHERE {
          ?nft ldo:assetURI ?assetURI;
        }
        `,
        {
          sources: respods,
          lenient: true,
        }
      );
      return new Promise((resolve, reject) => {
        bindingsStream.on("data", (binding) => {
          podList.push(binding.get("assetURI").value);
        });
        bindingsStream.on("end", () => {
          console.log("Query execution completed.");
          resolve(podList);
        });
        bindingsStream.on("error", (error) => {
          console.error("Error in query result stream:", error);
          reject(error);
        });
      });
    }
  }

  async function searchNFTs() {
    const returnValue = [];
    searchResult.innerText = "Searching...";
    if (searchValue) {
      const search = searchValue.toLowerCase();
      try {
        const myEngine = new QueryEngine();
        const bindingsStream = await myEngine.queryBindings(
          `
          PREFIX schema: <http://schema.org/>
          SELECT ?nft ?description ?title ?image ?creator ?owner ?uploadDate WHERE {
            ?nft schema:description ?description;
                schema:title ?title;
                schema:image ?image;
                schema:creator ?creator;
                schema:owner ?owner;
                schema:uploadDate ?uploadDate.
            FILTER(CONTAINS(LCASE(?description), "${search}")|| CONTAINS(LCASE(?title), "${search}"))
          }`,
          {
            // Sources field is optional. Will be derived from query if not provided.
            sources: pointerPods, // Sets your profile as query source
            // Session is optional for authenticated requests
            //'@comunica/actor-http-inrupt-solid-client-authn:session': session,
            // The lenient flag will make the engine not crash on invalid documents
            lenient: true,
          }
        );
        bindingsStream.on("data", (binding) => {
          returnValue.push({
            tokenURI: binding.get("nft").value,
            title: binding.get("title").value,
            description: binding.get("description").value,
            image: binding.get("image").value,
            creator: binding.get("creator").value,
            owner: binding.get("owner").value,
            uploadDate: binding.get("uploadDate").value,
          });
        });
        bindingsStream.on("end", () => {
          console.log("Return value: ", returnValue, returnValue.length);
          searchResult.textContent = "";
          console.log("Query execution completed.");
          if (returnValue.length === 0) {
            searchResult.textContent = "No results found";
            setData(null);
          } else {
            setData(returnValue);
          }
        });
        bindingsStream.on("error", (error) => {
          console.error("Error in query result stream:", error);
        });
      } catch (error) {
        console.error("Error: ", error);
        searchResult.textContent = "Error: " + error;
      }
    } else {
      searchResult.textContent = "Please enter a search term and try again";
    }
    setSearchValue("");
    setFetched(true);
  }

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
    console.log("Items: ", items);
    setFetched(true);
    setData(items);
  }

  useEffect(() => {
    const getPods = async () => {
      let respods = [];
      resource?.children().map((child) => respods.push(child.uri));
      const searchPods = await getPodUri(respods);
      console.log("searchPods:", searchPods);
      setPointerPods(searchPods);
    };

    getPods();
  }, []);

  useEffect(() => {
    if (!dataFetched && data === null) {
      console.log("fetching ALL...");
      getAllNFTs();
    } else if (!dataFetched) {
      console.log("fetching search...");
      searchNFTs();
    }
  }, [dataFetched, data]);

  return (
    <div>
      <Header />
      <div className="webpage">
        <h1>Marketplace</h1>
        <p className="hint">
          Explore Unique NFTs on the Leading Digital Marketplace!
        </p>
        <div className="search-box">
          <input
            id="searchInput"
            placeholder="Search your favourite NFTs..."
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div onClick={() => setFetched(false)} className="search-icon">
            <SearchOutlined />
          </div>
        </div>
        <p id="searchResult"></p>
      </div>
      <div className="nft-list">
        {data === null ? (
          <p>loading.....</p>
        ) : (
          data.map((item, index) => {
            return (
              <div key={index}>
                <NFTCard dataUri={item.tokenURI} token={item.tokenId} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Market;
