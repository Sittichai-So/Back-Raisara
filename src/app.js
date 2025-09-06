import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import config from "./configs.js";
import { connectDB } from "./database.js";
import authRoutes from "./auth/auth.route.js";

dotenv.config();

const app = express();
const port = config.app.port;

app.use(express.json());


connectDB();

app.use("/api/auth", authRoutes);


app.listen(port, () => {
  console.log(`🚀 Rai-sara is Running at port ${port}`);
});
