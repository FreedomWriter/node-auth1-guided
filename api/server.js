const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");

const configureMiddleware = require("./configure-middleware.js");

const server = express();
server.use(morgan("dev"));
server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(
  session({
    resave: false, //keep it false to avoid recreating sessions that have not changed
    saveUninitialized: false, // GDPR laws agains setting cookies automatically
    secret: "keep it secret, keep it safe!", // to cryptographically sign the cookie, should abstract into an environment variable (.env)
    cookie: {
      httpOnly: true, //javascript can't access the contents of the cookie
      maxAge: 1000 * 60 * 60 * 25 * 7, //logs user out after 7 days
      secure: false // in prod this should be true so the cookie header is encrypted
    }
  })
);

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
