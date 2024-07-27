import Marketplace from "../../contracts/Marketplace.json";
import { useLdo, useResource, useSubject } from "@ldo/solid-react";
import { useState, useContext, useMemo } from "react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
import { WalletContext } from "../../index";
import { Link } from "react-router-dom";
import { NFTCard } from "../card";
import "./style.scss";

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
            console.log("child: ", child);
            return (
              <NFTCard dataUri={child.uri} key={child.uri} />
            );
          })}
      </div>
    </div>
  );
};
