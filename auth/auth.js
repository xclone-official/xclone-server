const Router = require("express").Router();

Router.get("/", (req, res) => {
  res.send({
    msg: "Success",
  });
});

Router.use("/login", require("./login/login"));
Router.use("/register", require("./register/register"));
Router.use("/getUser", require("./getUser/getUser"));

module.exports = Router;
