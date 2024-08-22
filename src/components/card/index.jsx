import { useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLdo, useResource, useSubject } from "@ldo/solid-react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
import { WalletContext } from "../../index";
import { Button, Avatar, Card } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import "./card.scss";

export const NFTCard = ({ dataUri, token, data }) => {
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
    console.log(nftResource.status.message);
    return <></>;
  }

  let newTo;
  if (token) {
    newTo = {
      pathname: "/viewNFT/" + token,
    };
  } else {
    newTo = nft?.image?.["@id"];
  }

  const copyToClipboard = (txt) => {
    const tempInput = document.createElement("input");
    tempInput.value = txt;
    document.body.appendChild(tempInput);

    tempInput.select();
    document.execCommand("copy");

    document.body.removeChild(tempInput);
  };

  return (
    <Link to={newTo} state={{ data }} className="card">
      <Card cover={<img alt="example" src={blobUrl} />} className="exampleNFT">
        <div className="title">
          <h4>{nft.title}</h4>
        </div>
        <div className="creator">
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
          <span className="mt-2 txt">{nft.owner}</span>
          {/* <div
            class="copy-btn"
            onClick={(e) => {
              e.stopPropagation(); // 阻止事件冒泡，防止触发 Link 的点击跳转
              copyToClipboard(nft.owner);
            }}
          >
            <CopyOutlined />
          </div> */}
        </div>
      </Card>
    </Link>
  );
};
