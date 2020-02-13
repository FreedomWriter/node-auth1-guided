const express = require("express");
const bycrypt = require("bcryptjs");

const usersModel = require("../users/users-model.js");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const saved = await usersModel.add(req.body);

    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await usersModel.findBy({ username }).first();
    const passwordValid = await bycrypt.compare(password, user.password);

    if (user && passwordValid) {
      // stores the user data in the current session,
      // so it persists between request
      req.session.user = user;
      res.status(200).json({
        message: `Welcome ${user.username}!`
      });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/protected", async (req, res, next) => {
  try {
    if (!req.session || !req.session.user) {
      return res.status(403).json({
        message: "You are not authorized"
      });
    }
    res.json({
      message: "You are authorized"
    });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
