import http from "http";
import express from "express";
import { applyMiddleware, applyRoutes } from "./utils";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import routes from "./services";
import {Pool, Client} from "pg";

// load environment variables
require('dotenv').config();

// handle app breaking errors (avoid undefined state)
process.on("uncaughtException", e => {
    console.log(e);
    process.exit(1);
});

process.on("unhandledRejection", e => {
    console.log(e);
    process.exit(1);
});

// initialize express module and apply prepared middleware, routes, error handlers
const router = express();
applyMiddleware(middleware, router);
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);
// create HTTP server listening on port defined in .env
const PORT = process.env.PORT;
const server = http.createServer(router);

// connect to postgre - connector pulls config from .env by default
const client = new Client();
client.connect(err => {
    if (err) {
      console.error('connection error', err.stack)
    } else {
      console.log('connected')
    }
  })

server.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}...`)
);