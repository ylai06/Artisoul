import { useLdo, useResource, useSolidAuth } from "@ldo/solid-react";
import { useEffect, useState, Fragment } from "react";
import { Blog } from "../../components/blog";
import { MakeNFT } from "../../components/makeNFT";
import { PostNFT } from "../../components/postNFT";

const UploadImg = () => {
  const { session } = useSolidAuth();

  const { getResource } = useLdo();
  const [mainContainerUri, setMainContainerUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (session.webId) {
        // Get the WebId resource
        const webIdResource = await getResource(session.webId);
        console.log("webIdResource=>", webIdResource);
        // Get the root container associated with that WebId
        const rootContainerResult = await webIdResource.getRootContainer();
        // Check if there is an error
        console.log("rootContainerResult=>", rootContainerResult);
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
      <MakeNFT mainContainer={mainContainer} />
      <hr />
      {mainContainer
        // Get all the children of the main container
        ?.children()
        // Filter out children that aren't containers themselves
        .filter((child) => child.type === "container")
        // Render a "Post" for each child
        .map((child) => (
          <Fragment key={child.uri}>
            <PostNFT key={child.uri} postUri={child.uri} />
            <hr />
          </Fragment>
        ))}
    </main>
  );
};

function MintNFT() {
  return (
    <div>
      <h1>Mint NFT</h1>
      <UploadImg />
    </div>
  );
}

export default MintNFT;
