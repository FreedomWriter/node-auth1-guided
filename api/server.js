const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const router = require("express").Router();

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");

const configureMiddleware = require("./configure-middleware.js");

const server = express();
server.use(morgan("dev"));
server.use(helmet());
server.use(cors());
server.use(express.json());

configureMiddleware(server);

server.use("/auth", authRouter);
server.use("/users", usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "It's alive" });
});

server.use((err, req, res, next) => {
  console.log("Error: ", err.message);
  res.status(500).json({
    message: "Something went wrong",
    error: err.message
  });
});

module.exports = server;
