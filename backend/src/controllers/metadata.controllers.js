import { metadataModel } from "../models/metadata.model.js";

export const getMetadata = async (req, res) => {
  try {
    const metadata = await metadataModel.findById(req.params.id);
    if (!metadata) {
      return res
        .status(404)
        .json({ success: false, message: "Metadata not found" });
    }
    return res.json(metadata);
  } catch (error) {
    console.error("Fetch Metadata Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
