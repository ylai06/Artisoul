import { ContextDefinition } from "jsonld";

/**
 * =============================================================================
 * Typescript Typings for nftMetadata
 * =============================================================================
 */

/**
 * NFTShape Type
 */
export interface NFTShape {
  "@id"?: string;
  "@context"?: ContextDefinition;
  /**
   * The name of the NFT.
   */
  title: string;
  /**
   * The description of the NFT.
   */
  description?: string;
  /**
   * Date when this media object was uploaded to this site.
   */
  uploadDate: string;
  /**
   * A media object that encodes this CreativeWork. This property is a synonym for encoding.
   */
  image?: {
    "@id": string;
  };
  /**
   * The creator of the creative work.
   */
  creator: string;
  /**
   * The owner of the creative work.
   */
  owner: string;
}
