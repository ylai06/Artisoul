import { NFTCard } from "../card";
import "./style.scss";
// import { useEffect, useContext } from "react";
// import { PodContext } from "../..";

export const MyNFT = ({ mainContainer }) => {
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
          .map((child) => {
            return <NFTCard dataUri={child.uri} key={child.uri} />;
          })}
      </div>
    </div>
  );
};
