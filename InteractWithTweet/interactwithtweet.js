const Router = require("express").Router();

Router.use("/liketweet", require("./likeTweet/likeTweet"));
Router.use("/unliketweet", require("./unlikeTweet/unlikeTweet"));

// Comment To Tweet
Router.use("/commentoptions", require("./commentTweetActions/commentTweet"));

module.exports = Router;
