const router = require("express").Router();

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");

router.use("/auth", authRouter);
router.use("/users", usersRouter);

router.get("/", (req, res) => {
  res.json({ api: "It's alive" });
});

router.use((err, req, res, next) => {
  console.log("Error: ", err);
  res.status(500).json({
    message: "Something went wrong"
  });
});

module.exports = router;
