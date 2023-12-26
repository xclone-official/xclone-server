const Router = require("express").Router();

Router.use("/getmsg", require("./getMsg/getMsg"));

Router.use("/addmsg", require("./addMsg/addMsg"));

Router.use("/deletemsg", require("./deleteMsg/deleteMsg"));

Router.use("/editmsg", require("./editMsg/editMsg"));

module.exports = Router;
