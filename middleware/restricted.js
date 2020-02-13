const usersModel = require("../users/users-model");
const bycrypt = require("bcryptjs");

function restricted() {
  const authError = {
    message: "Invalid Credentials"
  };

  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json(authError);
    }

    next();
  };
}

module.exports = restricted;
