import { useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLdo, useResource, useSubject } from "@ldo/solid-react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
import { WalletContext } from "../../index";
import { Button } from "antd";

export const NFTCard = ({ dataUri, token }) => {
  const nftIndexUri = `${dataUri}index.ttl`;
  const nftResource = useResource(nftIndexUri);
  const nft = useSubject(NFTShape, nftIndexUri);
  // const { getResource } = useLdo();
  // const { walletDetails } = useContext(WalletContext);
  const imageResource = useResource(nft?.image?.["@id"]);

  const blobUrl = useMemo(() => {
    if (imageResource && imageResource.isBinary()) {
      return URL.createObjectURL(imageResource.getBlob());
    }
    return undefined;
  }, [imageResource]);

  if (nftResource.status.isError) {
    return <p>nftResource.status.message</p>;
  }

  let newTo;
  if (token) {
    newTo = {
      pathname: "/viewNFT/" + token,
    };
  } else {
    newTo = nft?.image?.["@id"];
  }

  return (
    <Link to={newTo}>
      <div className="container">
        <img src={blobUrl} alt="" className="image" crossOrigin="anonymous" />
      </div>
      <div className="text-container">
        <strong className="title">{nft.title}</strong>
        <p>owner: {nft.owner}</p>
        <p className="description">{nft.description}</p>
        {token && <Button>Details</Button>}
      </div>
    </Link>
  );
};
