import { useCallback, useState } from "react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
import { useSolidAuth, useLdo } from "@ldo/solid-react";
import { setWacRuleForAclUri } from "@ldo/solid";
import { Button, Input } from "antd";
import { v4 } from "uuid";
import {
  getSolidDatasetWithAcl,
  getPublicAccess,
  setPublicDefaultAccess,
  setPublicResourceAccess,
  createAcl,
  getAgentAccess,
  setAgentResourceAccess,
  setAgentDefaultAccess,
  saveAclFor,
  hasResourceAcl,
  hasFallbackAcl,
  hasAccessibleAcl,
  createAclFromFallbackAcl,
  getResourceAcl,
} from "@inrupt/solid-client";
import "./makeNFT.scss";

export const MakeNFT = ({ mainContainer }) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const { createData, commitData } = useLdo();
  const { session, fetch } = useSolidAuth();
  const webId = session.webId;

  // 查看公共訪問權限
  const onGetPublic = useCallback(async (e) => {
    e.preventDefault();
    if (!mainContainer) return;
    const myContainerUrl = mainContainer.uri;
    const myDatasetWithAcl = await getSolidDatasetWithAcl(myContainerUrl, {
      fetch: fetch,
    });
    const publicAccess = getPublicAccess(myDatasetWithAcl);
    console.log("public Access=>", publicAccess);
  }, []);

  // 設定公共訪問權限
  const onSetPublic = useCallback(async (e) => {
    e.preventDefault();
    if (!mainContainer) return;
    const myContainerUrl = mainContainer.uri;
    const myDatasetWithAcl = await getSolidDatasetWithAcl(myContainerUrl, {
      fetch: fetch,
    });
    console.log("myDatasetWithAcl=>", myDatasetWithAcl);
    let newRule = {
      read: true,
      append: false,
      write: false,
      control: false,
    };
    let resourceAcl = getResourceAcl(myDatasetWithAcl);
    if (!resourceAcl) {
      resourceAcl = createAcl(myDatasetWithAcl);
    }
    console.log("resourceAcl=>", resourceAcl);
    const updatedAcl = setPublicDefaultAccess(resourceAcl, newRule);
    await saveAclFor(myDatasetWithAcl, updatedAcl, { fetch: fetch });
    console.log("Set public Access=>", updatedAcl);
  }, []);

  // 查看Agent訪問權限
  const onGetAgent = useCallback(async (e) => {
    e.preventDefault();
    if (!mainContainer) return;
    const myContainerUrl = mainContainer.uri;
    const myDatasetWithAcl = await getSolidDatasetWithAcl(myContainerUrl, {
      fetch: fetch,
    });
    const publicAccess = getPublicAccess(myDatasetWithAcl);
    const resourceAcl = createAcl(myDatasetWithAcl);
    let updatedAcl = setAgentResourceAccess(resourceAcl, webId, {
      read: true,
      append: true,
      write: true,
      control: true,
    });
    await saveAclFor(myDatasetWithAcl, updatedAcl, { fetch: fetch });
    const myUpdateDatasetWithAcl = await getSolidDatasetWithAcl(
      myContainerUrl,
      { fetch: fetch }
    );
    const agentAccess = getAgentAccess(myUpdateDatasetWithAcl, webId);
    console.log("agentAccess=>", agentAccess);
  }, []);

  // 設定Agent訪問權限
  const onSetAgent = useCallback(async (e) => {
    e.preventDefault();

    console.log("onSet=>", mainContainer.uri, session);
    if (!mainContainer) return;

    // Set the ACL for the main container
    const aclUri = mainContainer.child(".acl").uri;
    console.log("aclUri=>", aclUri);
    const accessTo = mainContainer.uri;

    let newRule = {
      public: {
        read: true,
        append: false,
        write: false,
        control: false,
      },
      authenticated: {
        read: true,
        append: false,
        write: false,
        control: false,
      },
      agent: {
        [webId]: {
          read: true,
          append: true,
          write: true,
          control: true,
        },
      },
    };

    try {
      const result = await setWacRuleForAclUri(aclUri, newRule, accessTo);
      console.log("WAC rules set successfully:", result);
    } catch (error) {
      console.error("Error setting WAC rules:", error);
    }
    // Set the ACL for the main container
    // const aclData = createData(AclShape, acl.uri, acl);
    // aclData.accessTo = { "@id": mainContainer.uri };
    // aclData.agent = { "@id": "https://solid.community/profile/card#me" };
    // aclData.mode = "Control";
    // await commitData(aclData);
  }, []);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // TODO upload functionality
      // Don't create a post is main container isn't present
      if (!mainContainer) return;

      // Create the container for the post
      const postContainerResult = await mainContainer.createChildAndOverwrite(
        `${v4()}/`
      );
      // Check if there was an error
      if (postContainerResult.isError) {
        alert(postContainerResult.message);
        return;
      }
      // Get the created container
      const nftContainer = postContainerResult.resource;

      // Upload Image
      let uploadedImage;
      if (selectedFile) {
        const result = await nftContainer.uploadChildAndOverwrite(
          selectedFile.name,
          selectedFile,
          selectedFile.type
        );
        if (result.isError) {
          alert(result.message);
          await nftContainer.delete();
          return;
        }
        uploadedImage = result.resource;
      }

      // Create NFT 1. upload image 2. create metadata
      const metadata = nftContainer.child(`index.ttl`);
      // Create new data of type "Post" where the subject is the index
      // resource's uri, and write any changes to the indexResource.
      const nft_metadata = createData(NFTShape, metadata.uri, metadata);

      // Set the description
      nft_metadata.description = message;

      if (uploadedImage) {
        // Link the URI to the
        nft_metadata.image = { "@id": uploadedImage.uri };
      }

      // Say that the type is a "SocialMediaPosting"
      // nft_metadata.type = { "@id": "SocialMediaPosting" };
      // Add an upload date
      nft_metadata.title = "NFT-test";
      nft_metadata.creator = "0xC95B52BC6BC70a029DF892C4a9CA029B4eEDc558";
      nft_metadata.owner = "0xC95B52BC6BC70a029DF892C4a9CA029B4eEDc558";

      nft_metadata.uploadDate = new Date().toISOString();
      // The commitData function handles sending the data to the Pod.
      const result = await commitData(nft_metadata);
      if (result.isError) {
        alert(result.message);
      }
    },
    [message, selectedFile, mainContainer, createData, commitData]
  );

  return (
    <div>
      <h2>Set ACL</h2>
      <Button className="btn" onClick={onGetPublic}>
        Get Public ACL
      </Button>
      <Button className="btn" onClick={onSetPublic}>
        Set Public ACL
      </Button>
      <br />
      <Button className="btn" onClick={onGetAgent}>
        Get Agent ACL file
      </Button>
      <Button className="btn" onClick={onSetAgent}>
        Set Agent ACL
      </Button>
      {/* <h2>Upload NFT</h2>
      <form>
        <div className="details-box">
          <Input
            className="des-nft"
            type="text"
            placeholder="Name of the artwork"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Input
            className="des-nft"
            type="text"
            placeholder="Creator/Owner (User Address)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Input
            className="des-nft"
            type="text"
            placeholder="Descriptions"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <Input
          className="des-btn"
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0])}
        />
        <Button type="primary" onClick={onSubmit}>
          Upload
        </Button>
      </form> */}
    </div>
  );
};
