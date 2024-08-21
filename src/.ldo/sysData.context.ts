import { ContextDefinition } from "jsonld";

/**
 * =============================================================================
 * sysDataContext: JSONLD Context for sysData
 * =============================================================================
 */
export const sysDataContext: ContextDefinition = {
  userList: {
    "@id": "https://ldo.js.org/userList",
    "@type": "@id",
    "@container": "@set",
  },
  webID: {
    "@id": "https://ldo.js.org/webID",
    "@type": "@id",
  },
  nftList: {
    "@id": "https://ldo.js.org/nftList",
    "@type": "@id",
    "@container": "@set",
  },
  nftHash: {
    "@id": "https://ldo.js.org/nftHash",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  ownedBy: {
    "@id": "https://ldo.js.org/ownedBy",
    "@type": "@id",
  },
  ownedByAddress: {
    "@id": "https://ldo.js.org/ownedByAddress",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  assetTitle: {
    "@id": "https://ldo.js.org/assetTitle",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  assetURI: {
    "@id": "https://ldo.js.org/assetURI",
    "@type": "@id",
  },
};
