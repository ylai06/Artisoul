import { MakeNFT } from "../makeNFT";
import { PostNFT } from "../postNFT";
import { useLdo, useResource, useSolidAuth } from "@ldo/solid-react";
import { useCallback, useState, Fragment, useEffect } from "react";

export const Blog = () => {
  const { session } = useSolidAuth();

  const { getResource } = useLdo();
  const [mainContainerUri, setMainContainerUri] = useState();
  const mainContainer = useResource(mainContainerUri);

  useEffect(() => {
    if (session.webId) {
      // Get the WebId resource
      const webIdResource = getResource(session.webId);
      // Get the root container associated with that WebId
      webIdResource.getRootContainer().then((rootContainerResult) => {
        // Check if there is an error
        if (rootContainerResult.isError) return;
        // Get a child of the root resource called "my-solid-app/"
        const mainContainer = rootContainerResult.child("my-solid-app/");
        setMainContainerUri(mainContainer.uri);
        // Create the main container if it doesn't exist yet
        mainContainer.createIfAbsent();
      });
    }
  }, [getResource, session.webId]);

  if (!session.isLoggedIn) return <p>No blog available. Log in first.</p>;

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
