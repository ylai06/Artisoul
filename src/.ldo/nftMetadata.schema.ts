import { Schema } from "shexj";

/**
 * =============================================================================
 * nftMetadataSchema: ShexJ Schema for nftMetadata
 * =============================================================================
 */
export const nftMetadataSchema: Schema = {
  type: "Schema",
  shapes: [
    {
      id: "https://example.com/NFTShape",
      type: "ShapeDecl",
      shapeExpr: {
        type: "Shape",
        expression: {
          type: "EachOf",
          expressions: [
            {
              type: "TripleConstraint",
              predicate: "http://schema.org/title",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "title",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value: "The name of the NFT. ",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate: "http://schema.org/description",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "description",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value: "The description of the NFT. ",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate: "http://schema.org/uploadDate",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#date",
              },
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "uploadDate",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "Date when this media object was uploaded to this site.",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate: "http://schema.org/image",
              valueExpr: {
                type: "NodeConstraint",
                nodeKind: "iri",
              },
              min: 0,
              max: 1,
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "image",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value:
                      "A media object that encodes this CreativeWork. This property is a synonym for encoding.",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate: "http://schema.org/creator",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "creator",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value: "The creator of the creative work.",
                  },
                },
              ],
            },
            {
              type: "TripleConstraint",
              predicate: "http://schema.org/owner",
              valueExpr: {
                type: "NodeConstraint",
                datatype: "http://www.w3.org/2001/XMLSchema#string",
              },
              annotations: [
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#label",
                  object: {
                    value: "owner",
                  },
                },
                {
                  type: "Annotation",
                  predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
                  object: {
                    value: "The owner of the creative work.",
                  },
                },
              ],
            },
          ],
        },
        annotations: [
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#label",
            object: {
              value: "SocialMediaPost",
            },
          },
          {
            type: "Annotation",
            predicate: "http://www.w3.org/2000/01/rdf-schema#comment",
            object: {
              value:
                "A post to a social media platform, including blog posts, tweets, Facebook posts, etc.",
            },
          },
        ],
      },
    },
  ],
};
