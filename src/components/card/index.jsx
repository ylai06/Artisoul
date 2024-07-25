import { useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLdo, useResource, useSubject } from "@ldo/solid-react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
import { WalletContext } from "../../index";

export function NFTTile(data) {
  const nftIndexUri = `${data.dataUri}index.ttl`;
  const nftResource = useResource(nftIndexUri);
  const nft = useSubject(NFTShape, nftIndexUri);
  // const { getResource } = useLdo();
  // const { walletDetails } = useContext(WalletContext);
  const imageResource = useResource(nft?.image?.["@id"]);

  const PodUrl = "";
  const blobUrl = useMemo(() => {
    if (imageResource && imageResource.isBinary()) {
      return URL.createObjectURL(imageResource.getBlob());
    }
    return undefined;
  }, [imageResource]);

  if (nftResource.status.isError) {
    return <p>nftResource.status.message</p>;
  }

  // const newTo = {
  //   pathname: "/nftPage/" + nft.title,
  // };
  const newTo = nft?.image?.["@id"];

  return (
    <Link to={newTo} target="_blank">
      <div className="container">
        <img src={blobUrl} alt="" className="image" crossOrigin="anonymous" />
      </div>
      <div className="text-container">
        <strong className="title">{nft.title}</strong>
        <p>owner: {nft.owner}</p>
        <p className="description">{nft.description}</p>
      </div>
    </Link>
  );
}