import { useEffect, useState, useContext } from "react";
import Marketplace from "../../contracts/Marketplace.json";
import { useLocation } from "react-router";
import { v4 } from "uuid";
import "./sellNFT.scss";
import { Input, Image } from "antd";
import { useLdo } from "@ldo/solid-react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
const { TextArea } = Input;

export const CreateNFT = ({ mainContainer }) => {
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [fileContainer, setFileContainer] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const ethers = require("ethers");
  const [message, updateMessage] = useState("");
  const { createData, commitData } = useLdo();
  const location = useLocation();

  async function disableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = true;
    listButton.style.backgroundColor = "grey";
    listButton.style.opacity = 0.3;
  }

  async function enableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = false;
    listButton.style.backgroundColor = "#A500FF";
    listButton.style.opacity = 1;
  }

  //This function uploads the NFT image to Solid Pod
  async function OnChangeFile(e) {
    e.preventDefault();
    var file = e.target.files[0];
    if (!mainContainer || !file) return;

    // Create the container for the NFT metadata
    const postContainerResult = await mainContainer.createChildAndOverwrite(
      `${v4()}/`
    );

    if (postContainerResult.isError) {
      alert(postContainerResult.message);
      return;
    }

    // Get the created container
    const nftContainer = postContainerResult.resource;
    setFileContainer(nftContainer);

    // check for file extension
    try {
      //upload the file to Solid pod
      disableButton();
      updateMessage("Uploading image.. please don't click anything!");
      const response = await nftContainer.uploadChildAndOverwrite(
        file.name,
        file,
        file.type
      );

      if (response.isError) {
        updateMessage("Error: " + response.message);
        await nftContainer.delete();
        return;
      }
      enableButton();
      updateMessage("");
      console.log(
        "Uploaded image to your Solid pod success: ",
        response.resource.uri
      );
      setFileURL(response.resource.uri);
      // setUploadImg(response.resource);
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }

  //This function uploads the metadata to Solid Pod
  async function uploadMetadataToSolid() {
    const { name, description, price } = formParams;
    //Make sure that none of the fields are empty
    if (!name || !description || !price || !fileURL) {
      updateMessage("Please fill all the fields!");
      return -1;
    }

    const metadata = fileContainer.child(`index.ttl`);
    const nft_metadata = createData(NFTShape, metadata.uri, metadata);

    nft_metadata.description = description;
    nft_metadata.image = { "@id": fileURL };
    nft_metadata.title = name;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    nft_metadata.creator = signer.address;
    nft_metadata.owner = signer.address;
    nft_metadata.uploadDate = new Date().toISOString();

    const result = await commitData(nft_metadata);
    if (result.isError) {
      alert(result.message);
    }

    console.log(fileContainer.uri, "; NFT Metadata: ", result);
    return fileContainer.uri;
  }

  async function listNFT(e) {
    e.preventDefault();

    //Upload data to Solid pod
    try {
      const metadataURL = await uploadMetadataToSolid();
      if (metadataURL === -1) return;
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      disableButton();
      updateMessage(
        "Uploading NFT(takes 5 mins).. please don't click anything!"
      );

      console.log(
        "Signer: ",
        signer,
        "Marketplace.address: ",
        Marketplace.address,
        "Marketplace.abi: ",
        Marketplace.abi
      );

      //Get the deployed contract instance
      let contract = new ethers.Contract(
        // Marketplace.target,
        Marketplace.address,
        Marketplace.abi,
        signer
      );

      console.log("Contract: ", contract);

      //massage the params to be sent to the create NFT request
      const price = ethers.parseUnits(formParams.price, "ether");
      let listingPrice = await contract.getListPrice();
      listingPrice = listingPrice.toString();

      //actually create the NFT
      let transaction = await contract.createToken(metadataURL, price, {
        value: listingPrice,
      });
      await transaction.wait();

      alert("Successfully listed your NFT!");
      enableButton();
      updateFormParams({ name: "", description: "", price: "" });
      // window.location.replace("/"); // redirect to home page
    } catch (e) {
      alert("Upload error: " + e);
      enableButton();
      updateMessage("Error: " + e);
      updateFormParams({ name: "", description: "", price: "" });
    }
  }

  return (
    <div>
      <form>
        <h2>Create your NFT to the marketplace</h2>
        <div className="metadata">
          <div className="me-3 w-75">
            <div className="upload-img-box">
              <Input
                className="upload-img"
                type={"file"}
                accept="image/*"
                onChange={OnChangeFile}
              ></Input>
            </div>
            <div className="upload-box w-25">
              <Input
                id="name"
                type="text"
                placeholder="NFT Name"
                onChange={(e) =>
                  updateFormParams({ ...formParams, name: e.target.value })
                }
                value={formParams.name}
              ></Input>
            </div>
            <div className="upload-box">
              <Input
                type="number"
                placeholder="Price for this NFT."
                step="0.0001"
                value={formParams.price}
                onChange={(e) =>
                  updateFormParams({ ...formParams, price: e.target.value })
                }
              ></Input>
              <span>*Minium Price 0.0001 ETH</span>
            </div>
            <div className="upload-box">
              <TextArea
                autoSize={{ minRows: 3, maxRows: 5 }}
                id="description"
                type="text"
                placeholder="Description. ex: Axie Infinity Collection"
                value={formParams.description}
                onChange={(e) =>
                  updateFormParams({
                    ...formParams,
                    description: e.target.value,
                  })
                }
              ></TextArea>
            </div>
          </div>
          <div>{message}123</div>
          <button
            className="login-btn mt-4"
            type="primary"
            onClick={listNFT}
            id="list-button"
          >
            Mint NFT
          </button>
        </div>
        <Image
          width={200}
          height={200}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </form>
    </div>
  );
};
