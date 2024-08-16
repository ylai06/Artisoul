import { useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLdo, useResource, useSubject } from "@ldo/solid-react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
import { WalletContext } from "../../index";
import { Button, Avatar, Card } from "antd";
import "./card.scss";

export const NFTCard = ({ dataUri, token }) => {
  const nftIndexUri = dataUri.endsWith("index.ttl")
    ? `${dataUri}`
    : `${dataUri}index.ttl`;
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

  let walletAddress = "0xC95B52BC6BC70a029DF892C4a9CA029B4eEDc558";

  const getOwner = () => {
    return nft?.owner === walletAddress;
  };

  return (
    <Link to={newTo} className="card">
      <Card cover={<img alt="example" src={blobUrl} />} className="exampleNFT">
        <div className="title">
          <h4>{nft.title}</h4>
        </div>
        <div className="creator">
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
          <span className="mt-2">Animakid</span>
        </div>
      </Card>
      {/* <img src={blobUrl} alt="" className="image" crossOrigin="anonymous" />
      <div className="text">
        <strong className="title">{nft.title}</strong>
        {!getOwner() && <p>owner: {nft.owner}</p>}
        <p className="description">{nft.description || "no description"}</p>
        {token && <Button>Details</Button>}
      </div> */}
    </Link>
  );
};
