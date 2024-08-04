import { useCallback, useEffect, useState, useContext } from "react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
import { useSolidAuth, useLdo } from "@ldo/solid-react";
import { setWacRuleForAclUri, deleteResource, readResource } from "@ldo/solid";
import { createDataset } from "@ldo/dataset";
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
import { PodContext } from "../..";

export const SetACL = ({ mainContainer }) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [deleteState, setDeleteState] = useState(false);
  const { createData, commitData } = useLdo();
  const { session, fetch } = useSolidAuth();
  const { setPodLatestState } = useContext(PodContext);
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

  // 設定公共訪問權限（首次登入）
  const onSetPublic = useCallback(async (e) => {
    e.preventDefault();
    if (!mainContainer) return;
    const myContainerUrl = mainContainer.uri;
    const myDatasetWithAcl = await getSolidDatasetWithAcl(myContainerUrl, {
      fetch: fetch,
    });
    let resourceAcl = getResourceAcl(myDatasetWithAcl);
    let updatedAcl;
    if (!resourceAcl) {
      resourceAcl = createAcl(myDatasetWithAcl);
      console.log("resourceAcl=>", resourceAcl);
      let newRule = {
        read: true,
        append: true,
        write: true,
        control: false,
      };
      updatedAcl = setPublicResourceAccess(resourceAcl, newRule);
      await saveAclFor(myDatasetWithAcl, updatedAcl, { fetch: fetch });
    } else {
      updatedAcl = setPublicResourceAccess(resourceAcl, {
        read: true,
        append: true,
        write: true,
        control: false,
      });
      await saveAclFor(myDatasetWithAcl, updatedAcl, { fetch: fetch });
    }
    alert("Successfully set public ACL!!");
    console.log("Set public Access=>", updatedAcl);
  }, []);

  // 設定子資源公共訪問權限
  const onSetResourcePublic = useCallback(async (e) => {
    e.preventDefault();
    if (!mainContainer) return;
    const myContainerUrl = mainContainer.uri;
    console.log("myContainerUrl", myContainerUrl);
    const myDatasetWithAcl = await getSolidDatasetWithAcl(myContainerUrl, {
      fetch: fetch,
    });
    console.log("myDatasetWithAcl=>", myDatasetWithAcl);
    let resourceAcl = getResourceAcl(myDatasetWithAcl);
    let updatedAcl;
    if (!resourceAcl) {
      alert("You need to set public access first!!");
      return;
    }
    let newRule = {
      read: true,
      append: true,
      write: true,
      control: false,
    };
    updatedAcl = await setPublicDefaultAccess(resourceAcl, newRule);
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

  const deleteSource = [
    // <------ 這裡是要刪除的資料和資料夾
    "https://solidweb.me/NFT-asset/my-solid-app/906f1ecb-94c3-4de5-98d9-c91ebd64b3b7/",
    "https://solidweb.me/NFT-asset/my-solid-app/860efe8f-a18b-4c94-82db-9182336d9e6e/",
    "https://solidweb.me/NFT-asset/my-solid-app/2ec0f6a2-4b07-463e-bc9f-239b444cc55a/",
  ];

  useEffect(() => {
    if (deleteState) {
      if (!mainContainer) return;
      const res = mainContainer.children();
      if (res) {
        res.forEach(async (child) => {
          if (deleteSource.includes(child.uri)) {
            // check acl access of the child
            /**
            const myDatasetWithAcl = await getSolidDatasetWithAcl(child.uri, {
              fetch: fetch,
            });
            const publicAccess = getPublicAccess(myDatasetWithAcl);
            console.log("child Access=>", publicAccess);
             */
            // delFolder = [...delFolder, child.uri];
            let file = child.children();
            // delete index.ttl and image in the folder
            file.forEach(async (item) => {
              try {
                const result = await deleteResource(item.uri);
                console.log("delItem=>", result);
                let checkResponse = await readResource(item.uri);
                while (checkResponse.type !== "absentReadSuccess") {
                  checkResponse = await readResource(item.uri);
                  console.log("checkResponse=>", checkResponse);
                }
              } catch (err) {
                console.log("delResError=>", err);
                return;
              }
            });

            try {
              await deleteResource(child.uri);
              console.log("delFolder=>", child.uri);
            } catch (err) {
              console.log("delFolderError=>", err);
              return;
            }
          }
        });
      }
      setDeleteState(false);
      console.log("setPodLatestState in setACL");
      // setPodLatestState(false);
    }
  }, [deleteState]);

  return (
    <div>
      <h2>Set ACL</h2>
      <Button className="btn" onClick={onGetPublic}>
        Get Public ACL
      </Button>
      <Button className="btn" onClick={onSetPublic}>
        Set Public ACL
      </Button>
      <Button className="btn" onClick={onSetResourcePublic}>
        Set Child Resource ACL
      </Button>
      <br />
      <Button className="btn" onClick={() => setDeleteState(true)}>
        Delete problematic resources
      </Button>
      {/* <Button className="btn" onClick={onDelete}>
        Delete problematic resources
      </Button> */}
      {/* 
      <p>Set and get Agent ACL</p>
      <Button className="btn" onClick={onGetAgent}>
        Get Agent ACL file
      </Button>
      <Button className="btn" onClick={onSetAgent}>
        Set Agent ACL
      </Button> */}
      
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
