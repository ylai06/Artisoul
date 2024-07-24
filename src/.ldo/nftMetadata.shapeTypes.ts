import { ShapeType } from "@ldo/ldo";
import { nftMetadataSchema } from "./nftMetadata.schema";
import { nftMetadataContext } from "./nftMetadata.context";
import { NFTShape } from "./nftMetadata.typings";

/**
 * =============================================================================
 * LDO ShapeTypes nftMetadata
 * =============================================================================
 */

/**
 * NFTShape ShapeType
 */
export const NFTShapeShapeType: ShapeType<NFTShape> = {
  schema: nftMetadataSchema,
  shape: "https://example.com/NFTShape",
  context: nftMetadataContext,
};
