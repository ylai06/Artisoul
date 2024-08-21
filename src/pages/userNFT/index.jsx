import { useLdo, useResource, useSolidAuth } from "@ldo/solid-react";
import { useEffect, useState } from "react";
import { SetACL } from "../../components/setACL";
import { Header } from "../../components/header";
import { CreateNFT } from "../../components/createNFT";
import { MyNFT } from "../../components/myNFT";
import "./userNFT.scss";

export default function UserNFT() {
  const { session } = useSolidAuth();
  const { getResource } = useLdo();
  const [mainContainerUri, setMainContainerUri] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (session.webId) {
        // Get the WebId resource
        const webIdResource = getResource(session.webId);
        // console.log("webIdResource=>", webIdResource);
        // Get the root container associated with that WebId
        const rootContainerResult = await webIdResource.getRootContainer();
        // Check if there is an error
        // console.log("rootContainerResult=>", rootContainerResult);
        if (rootContainerResult.isError) {
          return;
        }
        // Get a child of the root resource called "my-solid-app/"
        const mainContainer = rootContainerResult.child("my-solid-app/");
        setMainContainerUri(mainContainer.uri);
        // Create the main container if it doesn't exist yet
        await mainContainer.createIfAbsent();
      }
    };
    fetchData();
  }, [getResource, session.webId]);

  const mainContainer = useResource(mainContainerUri);
  const userName = session.webId;

  useEffect(() => {}, [mainContainer, mainContainerUri]);

  // if (!session.isLoggedIn)
  //   return <p>This part is for upload your digital asset. Log in first.</p>;

  return (
    <div>
      <Header />
      <div className="intro-box webpage">
        <h1>Wallet Details</h1>
        <div className="wallet">
          <p className="title">Wallet Address</p>
          <p className="walletInfo">{session.webId}</p>
          <p className="title">Wallet Balance</p>
          <p className="walletInfo">0 ETH</p>
        </div>
        <h2>{userName + "'s" && "My"} NFTs</h2>
        <MyNFT mainContainer={mainContainer} />
      </div>
    </div>
  );
}
