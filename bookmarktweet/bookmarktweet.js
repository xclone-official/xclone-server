const Router = require("express").Router();

Router.use("/savebookmark", require("./savebookmark/savebookmark"));

module.exports = Router;
