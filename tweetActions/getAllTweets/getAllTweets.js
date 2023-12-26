const TweetModel = require("../../Models/TweetModel/TweetModel");
const Router = require("express").Router();
const UserModel = require("../../Models/UserModel/UserModel");

Router.get("/", async (req, res) => {
  try {
    const getAllTweetWithID = await TweetModel.find();

    let getAllTweet = await Promise.all(
      getAllTweetWithID.map(async (e) => {
        const user = await UserModel.findById(e?.authorId);

        // Include user details outside comments
        const tweetData = {
          authorName: user.fullname,
          authorUsername: user.username,
          authorProfile: user.profilepicture,
          ...e.toObject(),
        };

        // Include user details inside comments
        const commentsWithUserData = e.comments.map((comment) => ({
          ...comment.toObject(),
          authorName: user.fullname,
          authorUsername: user.username,
          authorProfile: user.profilepicture,
        }));

        // Combine the tweet data with comments data
        const requiredUserData = {
          ...tweetData,
          comments: commentsWithUserData,
        };

        return requiredUserData;
      })
    );
    if (getAllTweet) {
      return res.status(200).send({
        status: 1,
        msg: "Tweets found successfully.",
        tweet: getAllTweet,
      });
    } else {
      return res.status(200).send({
        status: 2,
        msg: "Error in finding Tweets.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: 4,
      msg: "Internal server error.",
    });
  }
});

module.exports = Router;
