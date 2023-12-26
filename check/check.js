const Router = require("express").Router();

Router.use("/password", require("./password/password"));
Router.use("/otp", require("./otp/otp"));
module.exports = Router;
