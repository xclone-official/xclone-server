const Router = require("express").Router();

Router.use("/follow", require("./followUser/followUser"));
Router.use("/unfollow", require("./unfollowUser/unfollowUser"));
Router.use("/userHasChatted", require("./userHasChatted/userHasChattedSave"));
module.exports = Router;
