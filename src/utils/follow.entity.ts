type EntitySchema = {
  name: string;
  nodeName: string;
  id: any;
  versions: {
    version: number;
    body: any[];
  }[];
};
const followSchema: EntitySchema = {
  name: "follow",
  nodeName: "follow",
  path: "/follow",
  versions: [
    {
      version: 1,
      // @ts-ignore
      id: "",
      body: [
        {
          name: "followTo",
          type: "string",
        },
      ],
    },
  ],
};

export default followSchema;
