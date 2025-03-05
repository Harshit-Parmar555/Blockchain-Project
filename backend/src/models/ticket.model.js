import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    eventDate: {
      type: String,
      required: true,
    },
    price: {
      type: String, // Store as string since it's in crypto
      required: true,
    },

    tokenURI: {
      type: String, // Stores the metadata API URL
      required: true,
    },
    owner: {
      type: String, // Wallet address of the owner
      default: null,
    },
    transactionHash: {
      type: String, // Hash of the mint transaction
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const ticketModel = mongoose.model("Ticket", ticketSchema);
