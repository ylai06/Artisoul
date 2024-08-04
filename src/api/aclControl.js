import {
  getSolidDataset,
  getContainedResourceUrlAll,
  deleteFile,
  deleteSolidDataset,
} from "@inrupt/solid-client";
import { useLdo, useResource, useSubject } from "@ldo/solid-react";

export async function deleteRecursively(dataset, control) {
  const containedResourceUrls = getContainedResourceUrlAll(dataset);
  const containedDatasets = await Promise.all(
    containedResourceUrls.map(async (resourceUrl) => {
      try {
        return await getSolidDataset(resourceUrl, control);
      } catch (e) {
        // The Resource might not have been a SolidDataset;
        // we can delete it directly:
        await deleteFile(resourceUrl, control);
        return null;
      }
    })
  );
  await Promise.all(
    containedDatasets.map(async (containedDataset) => {
      if (containedDataset === null) {
        return;
      }
      console.log("containedDataset=>", containedDataset);
      return await deleteRecursively(containedDataset);
    })
  );
  return await deleteSolidDataset(dataset, {
    fetch: fetch,
  });
}
