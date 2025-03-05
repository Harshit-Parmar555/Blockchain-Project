import { Router } from "express";
import {
  mint,
  buyTicket,
  getUserTickets,
  fetchTickets,
} from "../controllers/ticket.controller.js";
import { authRoute } from "../middlewares/auth.js";
const ticketRouter = Router();

ticketRouter.post("/mint", authRoute, mint);
ticketRouter.post("/buy", authRoute, buyTicket);
ticketRouter.get("/getall", authRoute, fetchTickets);
// ticketRouter.get("/get/:id", authRoute, getTicket);
ticketRouter.get("/user/:walletAddress", authRoute, getUserTickets);

export { ticketRouter };
