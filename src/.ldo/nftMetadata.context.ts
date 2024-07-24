import { ContextDefinition } from "jsonld";

/**
 * =============================================================================
 * nftMetadataContext: JSONLD Context for nftMetadata
 * =============================================================================
 */
export const nftMetadataContext: ContextDefinition = {
  title: {
    "@id": "http://schema.org/title",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  description: {
    "@id": "http://schema.org/description",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  uploadDate: {
    "@id": "http://schema.org/uploadDate",
    "@type": "http://www.w3.org/2001/XMLSchema#date",
  },
  image: {
    "@id": "http://schema.org/image",
    "@type": "@id",
  },
  creator: {
    "@id": "http://schema.org/creator",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  owner: {
    "@id": "http://schema.org/owner",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
};
