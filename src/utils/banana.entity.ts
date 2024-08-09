type EntitySchema = {
  name: string;
  nodeName: string;
  path: string;
  versions: {
    version: number;
    body: any[];
  }[];
};
const bananaSchema: EntitySchema = {
  name: "banana",
  nodeName: "banana",
  path: "/protocols/banana",
  versions: [
    {
      version: 1,
      body: [
        {
          name: "content",
          type: "string",
        },
        {
          name: "contentType",
          type: "string",
        },
        {
          name: "quotePin",
          type: "string",
        },
        {
          name: "attachments",
          type: "array",
        },
        {
          name: "mention",
          type: "array",
        },
      ],
    },
  ],
};

export default bananaSchema;
