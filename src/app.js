import express from "express";
import dotenv from "dotenv";
import cors from 'cors'

import { createServer } from 'http';
import { setupSocketIO } from './socket/index.js';

import config from "./configs.js";
import { connectDB } from "./database.js";
import indexRoute from "./index.routes.js"

dotenv.config();

const app = express();

app.use(cors())
const port = config.app.port;

app.use(express.json());

const server = createServer(app);
const io = setupSocketIO(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

connectDB();

app.use("/api/raisara", indexRoute);


app.listen(port, () => {
  console.log(`🚀 Rai-sara is Running at port ${port}`);
});
