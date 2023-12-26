const Router = require("express").Router();

Router.use(
  "/getFollowingFromUserId",
  require("./getFollowingFromUserId/getFollowingFromUserId")
);
Router.use(
  "/getFollowersFromUserId",
  require("./getFollowersFromUserId/getFollowersFromUserId")
);

Router.use("/getAllBookmarkById", require("./getAllBookmark/getAllBookmark"));

Router.use("/all", require("./all/all"));

Router.use("/getallfollowers", require("./getFollowers/getFollowers"));

Router.use("/getallfollowings", require("./getFollowing/getfollowings"));

module.exports = Router;
