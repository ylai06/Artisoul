import { ShapeType } from "@ldo/ldo";
import { sysDataSchema } from "./sysData.schema";
import { sysDataContext } from "./sysData.context";
import { UserList, UserId, NFTList, NFTs } from "./sysData.typings";

/**
 * =============================================================================
 * LDO ShapeTypes sysData
 * =============================================================================
 */

/**
 * UserList ShapeType
 */
export const UserListShapeType: ShapeType<UserList> = {
  schema: sysDataSchema,
  shape: "https://example.com/UserList",
  context: sysDataContext,
};

/**
 * UserId ShapeType
 */
export const UserIdShapeType: ShapeType<UserId> = {
  schema: sysDataSchema,
  shape: "https://example.com/UserId",
  context: sysDataContext,
};

/**
 * NFTList ShapeType
 */
export const NFTListShapeType: ShapeType<NFTList> = {
  schema: sysDataSchema,
  shape: "https://example.com/NFTList",
  context: sysDataContext,
};

/**
 * NFTs ShapeType
 */
export const NFTsShapeType: ShapeType<NFTs> = {
  schema: sysDataSchema,
  shape: "https://example.com/NFTs",
  context: sysDataContext,
};
