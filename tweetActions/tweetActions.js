const Router = require("express").Router();

Router.get("/", (req, res) => {
  res.send({
    msg: "Success",
  });
});

Router.use("/createtweet", require("./createTweet/createTweet"));
Router.use("/deletetweet", require("./deleteTweet/deleteTweet"));
Router.use("/getalltweet", require("./loadTweet/loadTweet"));
Router.use("/gettweetwithid", require("./getTweetWithId/getTweetWithId"));
Router.use("/updatetweet", require("./updateTweet/updateTweet"));
Router.use(
  "/getTweetfromfollowinguser",
  require("./getTweetfromfollowinguser/getTweetfromfollowinguser")
);
Router.use("/getALlLikes", require("./getAllLikes/getAllLikes"));
Router.use(
  "/getTweetFromFollowers",
  require("./getTweetFromFollowers/getTweetFromFollowers")
);

Router.use("/getusertweet", require("./getUserTweet/getUserTweet"));

Router.use("/getalltweets", require("./getAllTweets/getAllTweets"));

Router.use("/userlikedtweet", require("./userLikedTweet/userLikedTweet"));

Router.use("/tweetSeen", require("./tweetSeen/tweetSeen"));

module.exports = Router;
