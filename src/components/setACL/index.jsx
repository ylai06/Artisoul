import { useCallback, useEffect, useState } from "react";
import { NFTShapeShapeType as NFTShape } from "../../.ldo/nftMetadata.shapeTypes";
import { useSolidAuth, useLdo } from "@ldo/solid-react";
import { getWacUri, deleteResource, readResource } from "@ldo/solid";
import { createDataset } from "@ldo/dataset";
import { Checkbox, message as Msg } from "antd";
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
  getSolidDataset,
} from "@inrupt/solid-client";
import { setWacRuleForAclUriWithOri } from "../../wac/setWacRule";
import { deleteRecursively } from "../../api/aclControl";
import "./setACL.scss";

export const SetACL = ({ mainContainer }) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [deleteState, setDeleteState] = useState(false);
  const { createData, commitData } = useLdo();
  const { fetch } = useSolidAuth();
  const [publicAccess, setPublicAccess] = useState([]);
  const [agentAccess, setAgentAccess] = useState([]);
  const userPod = process.env.REACT_APP_USER_POD_LIST.split(",");

  const agentWebId = "https://solidweb.me/NFTsystem/profile/card#me"; // userPod[0]

  // 查看公共訪問權限
  const onGetPublic = useCallback(async () => {
    if (!mainContainer) return;
    const myContainerUrl = mainContainer.uri;
    const myDatasetWithAcl = await getSolidDatasetWithAcl(myContainerUrl, {
      fetch: fetch,
    });
    const publicAccess = getPublicAccess(myDatasetWithAcl);
    const result = Object.keys(publicAccess).filter(
      (key) => publicAccess[key] === true
    );
    setPublicAccess(result);
  }, [mainContainer]);

  // 設定公共訪問權限當前文件夾以及子資源（首次登入）
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
      updatedAcl = setPublicDefaultAccess(resourceAcl, newRule);
      await saveAclFor(myDatasetWithAcl, updatedAcl, { fetch: fetch });
    } else {
      let newRule = {
        read: true,
        append: true,
        write: true,
        control: false,
      };
      updatedAcl = setPublicResourceAccess(resourceAcl, newRule);
      await saveAclFor(myDatasetWithAcl, updatedAcl, { fetch: fetch });
      updatedAcl = setPublicDefaultAccess(resourceAcl, newRule);
      await saveAclFor(myDatasetWithAcl, updatedAcl, { fetch: fetch });
    }
    alert("Successfully set public ACL!!");
    onGetPublic();
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
      control: true,
    };
    updatedAcl = setPublicDefaultAccess(resourceAcl, newRule);
    await saveAclFor(myDatasetWithAcl, updatedAcl, { fetch: fetch });
    console.log("Set public Access=>", updatedAcl);
  }, []);

  // 設定當前資源以及子資源公共訪問權限
  const onSetPublicLDO = useCallback(async (e) => {
    e.preventDefault();
    if (!mainContainer) return;

    // Set the ACL for the main container
    const aclUri = mainContainer.child(".acl").uri;
    const res = await getWacUri(mainContainer.uri);

    let newRule = {
      public: {
        read: true,
        append: false,
        write: false,
        control: false,
      },
    };

    try {
      const result = await setWacRuleForAclUriWithOri(
        aclUri,
        newRule,
        mainContainer.uri,
        { fetch: fetch }
      );
      console.log("WAC rules set successfully:", result);
    } catch (error) {
      console.error("Error setting WAC rules:", error);
    }

    onGetAgent();
  }, []);

  // 查看Agent訪問權限
  const onGetAgent = useCallback(async () => {
    if (!mainContainer) return;
    const myContainerUrl = mainContainer.uri;
    const myDatasetWithAcl = await getSolidDatasetWithAcl(myContainerUrl, {
      fetch: fetch,
    });
    const access = getAgentAccess(myDatasetWithAcl, agentWebId);
    const result = Object.keys(access).filter((key) => access[key] === true);
    setAgentAccess(result);
  }, []);

  // 設定Agent訪問權限
  const onSetAgent = useCallback(async (e) => {
    e.preventDefault();
    if (!mainContainer) return;

    // Set the ACL for the main container
    const aclUri = mainContainer.child(".acl").uri;
    const res = await getWacUri(mainContainer.uri);

    const originURL = "https://penny.vincenttunru.com";

    let newRule = {
      public: {
        read: true,
        append: false,
        write: false,
        control: false,
      },
      authenticated: {
        read: true,
        append: true,
        write: true,
        control: false,
      },
      agent: {
        [agentWebId]: {
          read: true,
          append: true,
          write: true,
          control: true,
          origin: originURL,
        },
      },
    };

    try {
      await setWacRuleForAclUriWithOri(aclUri, newRule, mainContainer.uri, {
        fetch: fetch,
      });
      Msg.success("Successfully set public and agent WACs!", 3);
    } catch (error) {
      // console.error("Error setting WAC rules:", error);
      Msg.error(`Error setting WAC rules! ${error}`, 3);
    }

    onGetAgent();
    onGetPublic();
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
      console.log("postContainerResult=>", postContainerResult);
      // Check if there was an error
      if (postContainerResult.isError) {
        alert(postContainerResult.message);
        return;
      }
      // Get the created container
      const nftContainer = postContainerResult.resource;

      console.log("selectedFile=>", selectedFile);
      console.log("selectedFile.name=>", selectedFile.name);
      // Upload Image
      let uploadedImage;
      if (selectedFile) {
        const result = await nftContainer.uploadChildAndOverwrite(
          selectedFile.name,
          selectedFile,
          selectedFile.type
        );
        console.log("result=>", result);

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
    "",
    // <------ 這裡是要刪除的資料和資料夾
    // <------ 這裡是要刪除的資料夾
  ];

  const buyerWebId = "https://solidweb.org/profile/card#me";
  const buyNFTUri = "";

  useEffect(() => {
    if (deleteState) {
      if (!mainContainer) return;
      const res = mainContainer.children();
      console.log("res=>", res);
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
            // console.log("child=>", child.uri);
            // delFolder = [...delFolder, child.uri];
            try {
              let file = child.children();
              const dataset = await getSolidDataset(`${child.uri}`, {
                fetch: fetch,
              });

              // delete index.ttl and image in the folder
              deleteRecursively(dataset, {
                fetch: fetch,
              });
            } catch (e) {
              // delete the folder
              try {
                await deleteResource(child.uri);
                console.log("delFolder=>", child.uri);
              } catch (err) {
                console.log("delFolderError=>", err);
                return;
              }
            }
          }
        });
      }
      setDeleteState(false);
    }
  }, [deleteState, publicAccess, agentAccess]);

  useEffect(() => {
    if (onGetPublic) onGetPublic();
    if (onGetAgent) onGetAgent();
  }, [onGetPublic, onGetAgent]);

  const optionsPublic = [
    {
      label: "read",
      value: "read",
    },
    {
      label: "write",
      value: "write",
    },
    {
      label: "append",
      value: "append",
    },
    {
      label: "control",
      value: "control",
    },
  ];

  const optionsAgent = [
    {
      label: "read",
      value: "read",
    },
    {
      label: "write",
      value: "write",
    },
    {
      label: "append",
      value: "append",
    },
    {
      label: "control",
      value: "control",
    },
  ];

  return (
    <div className="setacl">
      <h3>Step1: Set web access control list</h3>
      <p className="hint mb-0">
        Learn more about{" "}
        <a
          href="https://solid.github.io/web-access-control-spec/#access-modes"
          target="_blank"
          style={{ textDecoration: "underline", color: "#8B008B" }}
        >
          WAC(Web Access Control)
        </a>
      </p>
      <h4>Access control list for public</h4>
      <p className="hint">
        *Before minting, you should allow the public to access your pod. Remind
        you that this only allow public read access, while you retain full
        access to your data.
      </p>
      <Checkbox.Group
        options={optionsPublic}
        disabled
        value={publicAccess}
        className="checkbox"
      />
      <h4>Access control list for agent</h4>
      <p className="hint">
        *Additionally, when a user purchases the NFT, the buyer will become an
        agent with the right to transfer the NFT's data to their own Solid POD.
        This permission will be granted as part of the post-purchase process.
      </p>
      <Checkbox.Group
        options={optionsAgent}
        disabled
        value={agentAccess}
        className="checkbox"
      />
      <button className="login-btn m-4" onClick={onSetAgent}>
        Grant Access
      </button>

      {/* <Button type="primary" className="btn" onClick={onGetPublic}>
        Get Public ACL
      </Button>
      <Button type="primary" className="btn" onClick={onSetResourcePublic}>
        Set Child Resource ACL
      </Button>
      <Button
        type="primary"
        className="btn"
        onClick={() => setDeleteState(true)}
      >
        Delete problematic resources
      </Button>
      <Button type="primary" className="btn" onClick={onGetAgent}>
        Get Agent ACL file
      </Button>
      <Button type="primary" className="btn" onClick={onSetPublic}>
          Set Public ACL
        </Button> */}
      {/* Here you only upload image to solid pod, no ethereum blockchain */}
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
