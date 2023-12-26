const Router = require("express").Router();

Router.use("/sendOTP", require("./sendOTP/sendOTP"));

module.exports = Router;
