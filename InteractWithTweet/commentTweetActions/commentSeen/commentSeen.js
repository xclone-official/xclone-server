const TweetModel = require("../../../Models/TweetModel/TweetModel");
const UserModel = require("../../../Models/UserModel/UserModel");

const Router = require("express").Router();

Router.put("/", async (req, res) => {
  try {
    const { tweetId, commentId, userId } = req.body;

    // Check if required parameters are missing
    if (!tweetId || !commentId || !userId) {
      return res.status(400).json({
        status: 3,
        msg: "tweetId, commentId, or userId is missing in the request.",
      });
    }

    // Find the tweet by tweetId
    const tweet = await TweetModel.findById(tweetId);

    // Check if the tweet exists
    if (!tweet) {
      return res.status(404).json({
        status: 2,
        msg: "Tweet doesn't exist.",
      });
    }

    // Find the specific comment within the tweet
    const comment = tweet.comments.filter((c) => c._id.equals(commentId));

    // Check if the comment exists
    if (!comment) {
      return res.status(404).json({
        status: 2,
        msg: "Comment doesn't exist.",
      });
    }
    console.log(comment[0]);
    // Check if userId is not already in the commentSeen array
    if (!comment[0].commentSeen.includes(userId)) {
      // If userId is not in the array, add it
      comment[0].commentSeen.push(userId);

      // Save the updated tweet
      await tweet.save();

      return res.status(200).json({
        status: 1,
        msg: "Comment Seen.",
      });
    }

    return res.status(200).json({
      status: 1,
      msg: "Comment Already Seen.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 3,
      msg: "Internal server error.",
    });
  }
});

module.exports = Router;
