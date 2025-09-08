import express from "express";
import dotenv from "dotenv";

import config from "./configs.js";
import { connectDB } from "./database.js";
import indexRoute from "./index.routes.js"

dotenv.config();

const app = express();
const port = config.app.port;

app.use(express.json());


connectDB();

app.use("/api/raisara", indexRoute);


app.listen(port, () => {
  console.log(`🚀 Rai-sara is Running at port ${port}`);
});
