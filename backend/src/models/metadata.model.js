import { model, Schema } from "mongoose";

const metaDataSchema = Schema({
  name: String,
  description: String,
  image: String,
  attributes: [
    {
      trait_type: String,
      value: String,
    },
  ],
});

export const metadataModel = model("Metadata", metaDataSchema);
