import { ContextDefinition } from "jsonld";

/**
 * =============================================================================
 * Typescript Typings for sysData
 * =============================================================================
 */

/**
 * UserList Type
 */
export interface UserList {
  "@id"?: string;
  "@context"?: ContextDefinition;
  /**
   * A list of users identified by their WebIDs.
   */
  userList?: UserId[];
}

/**
 * UserId Type
 */
export interface UserId {
  "@id"?: string;
  "@context"?: ContextDefinition;
  /**
   * A user's WebID (Web Identifier).
   */
  webID: {
    "@id": string;
  };
}

/**
 * NFTList Type
 */
export interface NFTList {
  "@id"?: string;
  "@context"?: ContextDefinition;
  /**
   * A list of NFTs with their associated metadata.
   */
  nftList?: NFTs[];
}

/**
 * NFTs Type
 */
export interface NFTs {
  "@id"?: string;
  "@context"?: ContextDefinition;
  nftHash: string;
  /**
   * The NFT is owned by a user (identified by WebID).
   */
  ownedBy: {
    "@id": string;
  };
  /**
   * The NFT is owned by a user (identified by wallet address).
   */
  ownedByAddress: string;
  /**
   * NFT's asset title.
   */
  assetTitle: string;
  /**
   * URI pointing to the NFT's asset.
   */
  assetURI: {
    "@id": string;
  };
}
