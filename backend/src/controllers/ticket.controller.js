import { ethers } from "ethers";
import { ticketModel } from "../models/ticket.model.js";
import { metadataModel } from "../models/metadata.model.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

// BLOCKCHAIN SETUP
const provider = new ethers.JsonRpcProvider(process.env.POLYGON_MUMBAI_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse the ABI JSON file
const abiPath = path.join(
  __dirname,
  "../../../bounty-sa8f3/artifacts/contracts/TicketNFT.sol/TicketNFT.json"
);
const ticketContractABI = JSON.parse(fs.readFileSync(abiPath, "utf-8")).abi;

const ticketContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  ticketContractABI,
  wallet
);

// MINT TICKET
export const mint = async (req, res) => {
  try {
    const { eventName, eventDate, price, image } = req.body;

    if (!eventName || !eventDate || !price || !image) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ Store Metadata in MongoDB
    const metadata = new metadataModel({
      name: eventName + " Ticket",
      description: `Ticket for ${eventName} on ${eventDate}`,
      image,
      attributes: [
        { trait_type: "Event", value: eventName },
        { trait_type: "Date", value: eventDate },
      ],
    });

    const savedMetadata = await metadata.save();

    // ✅ Generate `tokenURI` using your API
    const tokenURI = `${process.env.BASE_URL}/metadata/${savedMetadata._id}`;

    // ✅ Call Smart Contract Function
    let tx;
    try {
      tx = await ticketContract.mintTicket(wallet.address, tokenURI);
      console.log("Mint Transaction Hash:", tx.hash);
    } catch (contractError) {
      console.error("Smart Contract Call Failed:", contractError);
      return res.status(500).json({
        success: false,
        message: "Smart contract execution failed",
      });
    }

    const receipt = await tx.wait();

    // ✅ Fix tokenId extraction
    let tokenId = null;
    try {
      const eventInterface = new ethers.Interface(ticketContractABI);
      for (const log of receipt.logs) {
        try {
          const parsedLog = eventInterface.parseLog(log);
          if (parsedLog.name === "Transfer") {
            tokenId = parsedLog.args.tokenId.toString();
            break;
          }
        } catch (err) {
          continue; // Skip logs that don't match
        }
      }
    } catch (error) {
      console.error("Error parsing logs:", error);
    }

    if (!tokenId) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve tokenId from transaction logs",
      });
    }

    console.log("Extracted tokenId:", tokenId);

    // ✅ Fix: Use `tx.hash` instead of `receipt.transactionHash`
    const transactionHash = tx.hash;

    // ✅ Save Ticket in MongoDB
    const ticket = new ticketModel({
      eventName,
      eventDate,
      price,
      tokenURI, // Store tokenURI
      transactionHash,
    });

    await ticket.save();

    return res.status(201).json({
      success: true,
      message: "Ticket minted successfully",
      ticket,
    });
  } catch (error) {
    console.error("Mint Ticket Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// BUY TICKET
export const buy = async (req, res) => {
  try {
    const { _id, buyerAddress } = req.body;

    // ✅ Validate Input
    if (!_id || !buyerAddress) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // ✅ Fetch Ticket Price from Database
    const ticket = await ticketModel.findById(_id);
    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    const ticketPrice = ethers.parseEther(ticket.price.toString());

    // ✅ Call Smart Contract Function (Buy NFT)
    let tx;
    try {
      tx = await ticketContract
        .connect(signer)
        .buyTicket({ value: ticketPrice });
      console.log("Buy Transaction Hash:", tx.hash);
    } catch (contractError) {
      console.error("Smart Contract Execution Failed:", contractError);
      return res
        .status(500)
        .json({ success: false, message: "Smart contract execution failed" });
    }

    const receipt = await tx.wait(); // Wait for transaction confirmation
    const transactionHash = receipt.transactionHash;

    // ✅ Update Ticket Ownership in Database
    ticket.owner = buyerAddress.toLowerCase(); // Store lowercase address
    ticket.transactionHash = transactionHash; // Save the transaction hash
    await ticket.save();

    return res.status(200).json({
      success: true,
      message: "Ticket purchased successfully",
      ticket,
      transactionHash,
    });
  } catch (error) {
    console.error("Buy Ticket Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error in Buy Ticket Controller",
    });
  }
};

// BUY TICKET
export const buyTicket = async (req, res) => {
  try {
    const { _id, buyerAddress } = req.body; // Assuming you send userId and ticketId in the request body

    // Fetch the user and ticket data from the database
    const ticket = await ticketModel.findById(_id);

    if (!ticket) {
      return res.status(404).json({ message: "User or Ticket not found" });
    }

    ticket.owner = buyerAddress.toLowerCase(); // Save the userId as the purchaser
    await ticket.save();

    // Send a success response with the ticket and user info
    res.status(200).json({
      message: "Ticket purchased successfully",
      ticket,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET TICKET
// export const getTicket = async (req, res) => {
//   try {
//     const { tokenId } = req.params;

//     // ✅ Find ticket in MongoDB
//     const ticket = await ticketModel.findOne({ tokenId });

//     if (!ticket) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Ticket not found" });
//     }

//     return res.status(200).json({ success: true, ticket });
//   } catch (error) {
//     console.error("Get Ticket Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error in Get Ticket Controller",
//     });
//   }
// };

// GET USER TICKETS
export const getUserTickets = async (req, res) => {
  try {
    const { buyerAddress } = req.params;

    // ✅ Find all tickets belonging to this user
    const tickets = await ticketModel.find({
      owner: buyerAddress.toLowerCase(),
    });

    if (!tickets.length) {
      return res
        .status(404)
        .json({ success: false, message: "No tickets found for this user" });
    }

    return res.status(200).json({ success: true, tickets });
  } catch (error) {
    console.error("Get User Tickets Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error in Get User Tickets Controller",
    });
  }
};

// GET ALL TICKETS
export const fetchTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.find();
    if (tickets.length === 0) {
      return res.status(200).send({
        success: true,
        message: "No tickets found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Tickets fetched",
      tickets: tickets,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error : Fetch tickets controller",
    });
  }
};
