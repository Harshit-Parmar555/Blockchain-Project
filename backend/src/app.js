import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { userRouter } from "./routes/user.route.js";
import { ticketRouter } from "./routes/ticket.route.js";
import { metaRouter } from "./routes/metadata.route.js";

//  APP
const app = express();

// MIDDLEWARES
app.use(cookieParser());
app.use(express.json());

// ROUTES
app.use("/api/v1/user", userRouter);
app.use("/api/v1/ticket", ticketRouter);
app.use("/api/v1/meta", metaRouter);

export { app };
