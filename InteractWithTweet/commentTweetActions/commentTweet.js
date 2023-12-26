const Router = require("express").Router();

// Comment Options

Router.use("/comment", require("./commentOnTweet/commentOnTweet"));
Router.use("/commentseen", require("./commentSeen/commentSeen"));
Router.use("/likeoncomment", require("./likeOnComment/likeOnComment"));
// Reply Options
Router.use(
  "/replycommentontweet",
  require("./replyCommentOnTweet/replyCommentOnTweet")
);
Router.use("/replylike", require("./replyLike/replyLike"));

module.exports = Router;
