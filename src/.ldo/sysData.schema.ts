import { Schema } from "shexj";

/**
 * =============================================================================
 * sysDataSchema: ShexJ Schema for sysData
 * =============================================================================
 */
export const sysDataSchema: Schema = {
  type: "Schema",
  shapes: [
    {
      id: "https://example.com/UserList",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "TripleConstraint",
          predicate: "https://ldo.js.org/userList",
          valueExpr: "https://example.com/UserId",
          min: 0,
          max: -1,
          annotations: [
            {
              type: "Annotation",
              predicate: "http://www.w3.org/2000/01/rdf-schema#label",
              object: {
                value: "userList",
              },
            },
            {
              type: "Annotation",
              predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
              object: {
                value: "A list of users identified by their WebIDs.",
              },
            },
          ],
        },
      },
    },
    {
      id: "https://example.com/UserId",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "TripleConstraint",
          predicate: "https://ldo.js.org/webID",
          valueExpr: {
            type: "NodeConstraint",
            nodeKind: "iri",
          },
          annotations: [
            {
              type: "Annotation",
              predicate: "http://www.w3.org/2000/01/rdf-schema#label",
              object: {
                value: "webID",
              },
            },
            {
              type: "Annotation",
              predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
              object: {
                value: "A user's WebID (Web Identifier).",
              },
            },
          ],
        },
      },
    },
    {
      id: "https://example.com/NFTList",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "TripleConstraint",
          predicate: "https://ldo.js.org/nftList",
          valueExpr: "https://example.com/NFTs",
          min: 0,
          max: -1,
          annotations: [
            {
              type: "Annotation",
              predicate: "http://www.w3.org/2000/01/rdf-schema#label",
              object: {
                value: "nftList",
              },
            },
            {
              type: "Annotation",
              predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
              object: {
                value: "A list of NFTs with their associated metadata.",
              },
            },
          ],
        },
      },
    },
    {
      id: "https://example.com/NFTs",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "https://ldo.js.org/nftHash",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "nftHash",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate: "https://ldo.js.org/ownedBy",
              valueExpr: {
                type: "NodeConstraint",
                nodeKind: "iri",
              },
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "ownedBy",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value: "The NFT is owned by a user (identified by WebID).",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate: "https://ldo.js.org/ownedByAddress",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "ownedByAddress",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "The NFT is owned by a user (identified by wallet address).",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate: "https://ldo.js.org/assetTitle",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "assetTitle",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value: "NFT's asset title.",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate: "https://ldo.js.org/assetURI",
              valueExpr: {
                type: "NodeConstraint",
                nodeKind: "iri",
              },
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "assetURI",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value: "URI pointing to the NFT's asset.",
                  },
                },
              ],
            },
          ],
        },
      },
    },
  ],
};
