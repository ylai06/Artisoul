import { FunctionComponent, useCallback, useMemo, useContext } from "react";
import { useLdo, useResource, useSubject } from "@ldo/solid-react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
import { WalletContext } from "../../index";

export const PostNFT = ({ postUri }) => {
  const nftIndexUri = `${postUri}index.ttl`;
  const nftResource = useResource(nftIndexUri);
  const nft = useSubject(NFTShape, nftIndexUri);
  const { getResource } = useLdo();
  const { walletDetails } = useContext(WalletContext);
  const imageResource = useResource(nft?.image?.["@id"]);

  // Convert the blob into a URL to be used in the img tag
  const blobUrl = useMemo(() => {
    if (imageResource && imageResource.isBinary()) {
      return URL.createObjectURL(imageResource.getBlob());
    }
    return undefined;
  }, [imageResource]);

  const mintNFT = async (e) => {
    try {
      console.log("walletDetails=>", walletDetails);
    } catch (error) {
      console.error("Error:", error);
      return;
    }
    e.preventDefault();
    const address = walletDetails.walletAddress;
    const tokenUri = postUri;
    try {
      const response = await fetch("http://localhost:3001/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, tokenUri }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Mint NFT successfully", data.message);
      } else {
        alert("Error minting NFT");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error minting NFT");
    }
  };

  const deletePost = useCallback(async () => {
    const nftContainer = getResource(postUri);
    await nftContainer.delete();
  }, [postUri, getResource]);

  if (nftResource.status.isError) {
    console.log(nftResource.status.message);
    return <></>;
  }

  return (
    <div>
      <h3>{nft.title}</h3>
      <p>creator: {nft.creator}</p>
      <p>{nft.description}</p>
      <p>NFT URI: {postUri}</p>
      {blobUrl && (
        <div>
          <a href={blobUrl}>Browser</a> | <a href={nft?.image?.["@id"]}>pod</a>
          <img src={blobUrl} alt={nft.description} style={{ height: 300 }} />
        </div>
      )}
      <button onClick={mintNFT}>Mint NFT</button>
      <br />
      <button onClick={deletePost}>Delete</button>
    </div>
  );
};
