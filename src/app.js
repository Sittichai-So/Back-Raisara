import express from "express";
import dotenv from "dotenv";
import cors from 'cors'

import http from "http";
import initSocket from "./socket/index.js";

import config from "./configs.js";
import { connectDB } from "./database.js";
import indexRoute from "./index.routes.js"

dotenv.config();

const app = express();

const server = http.createServer(app);

initSocket(server);

server.listen(8012, () => {
  console.log("Server is running on port 8012");
});


app.use(cors())
const port = config.app.port;

app.use(express.json());

connectDB();

app.use("/api/raisara", indexRoute);


app.listen(port, () => {
  console.log(`🚀 Rai-sara is Running at port ${port}`);
});
