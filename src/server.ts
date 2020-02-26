import http from "http";
import express from "express";
import { applyMiddleware, applyRoutes } from "./utils";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import routes from "./services";

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
// create HTTP server listening on port 3000
const { PORT = 3000 } = process.env;
const server = http.createServer(router);

// const pg = require("pg");
// pg.connect('postgres://postgres:1docker2pass3@localhost:5432/rimacapidb');

server.listen(PORT, () =>
    console.log(`Server is running on http://localhost:${PORT}...`)
);