import { useLdo, useResource, useSolidAuth } from "@ldo/solid-react";
import { useEffect, useState, createContext, useContext } from "react";
import { SetACL } from "../../components/setACL";
import { SellNFT } from "../../components/sellNFT";
import { MyNFT } from "../../components/myNFT";
import { PodContext } from "../..";

const UploadImg = () => {
  const { session } = useSolidAuth();
  const { getResource } = useLdo();
  const [mainContainerUri, setMainContainerUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          setIsLoading(false);
          return;
        }
        // Get a child of the root resource called "my-solid-app/"
        const mainContainer = rootContainerResult.child("my-solid-app/");
        setMainContainerUri(mainContainer.uri);
        // Create the main container if it doesn't exist yet
        await mainContainer.createIfAbsent();
        setIsLoading(false); // Set loading state to false after loading is done
      }
    };
    fetchData();
  }, [getResource, session.webId]);

  const mainContainer = useResource(mainContainerUri);

  useEffect(() => {}, [mainContainer, mainContainerUri]);

  if (!session.isLoggedIn)
    return <p>This part is for upload your digital asset. Log in first.</p>;

  if (isLoading) return <p>Loading...</p>;

  return (
    <main>
      <SetACL mainContainer={mainContainer} />
      <MyNFT mainContainer={mainContainer} />
    </main>
  );
};

function MintNFT() {
  const { podLatestState, setPodLatestState } = useContext(PodContext);

  useEffect(() => {
    console.log("podLatestState=>", podLatestState);
    if (!podLatestState) {
      console.log("podLatestState=>", !podLatestState);
      setPodLatestState(true);
    }
  }, [podLatestState]);

  return (
    <div>
      <h1>Mint NFT</h1>
      <UploadImg />
    </div>
  );
}

export default MintNFT;
