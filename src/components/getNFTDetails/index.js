import { useResource, useSubject } from "@ldo/solid-react";
import { useMemo } from "react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";

export const GetNFTDetails = ({ tokenURI }) => {
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
    return <p>nftResource.status.message</p>;
  }
  const imgURL = nft?.image?.["@id"];
  const nftData = {
    name: nft.title,
    description: nft.description,
    image: imgURL,
  };

  return nftData;
};
