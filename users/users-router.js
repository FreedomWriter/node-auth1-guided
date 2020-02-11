const router = require("express").Router();
const bycrypt = require("bcryptjs");

const usersModel = require("./users-model.js");

function restricted() {
  const authError = {
    message: "Invalid Credentials"
  };

  return async (req, res, next) => {
    try {
      const { username, password } = req.headers;
      if (!username || !password) {
        return res.status(401).json(authError);
      }
      const user = await usersModel.findBy({ username }).first();
      if (!user) {
        return res.status(401).json(authError);
      }
      const passwordValid = await bycrypt.compare(password, user.password);
      if (!passwordValid) {
        return res.status(401).json(authError);
      }
      // if we reach this point in the code we know that the user is authenticated
      next();
    } catch (err) {
      next(err);
    }
  };
}

router.get("/", restricted(), async (req, res, next) => {
  try {
    const users = await usersModel.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
