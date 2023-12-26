const Router = require("express").Router();
const TweetModel = require("../../Models/TweetModel/TweetModel");

// Update the tweet content
Router.put("/:tweetId", async (req, res) => {
  try {
    const { tweetId } = req.params;
    const { tweetContent } = req.body;

    // Check if tweetId and tweetContent are provided
    if (!tweetId || !tweetContent) {
      return res.status(400).json({
        status: 1,
        msg: "Tweet ID and tweet content are required.",
      });
    }

    // Find the tweet by its ID and update the tweetContent
    const updatedTweet = await TweetModel.findByIdAndUpdate(
      tweetId,
      { tweetContent },
      { new: true }
    );

    if (!updatedTweet) {
      return res.status(404).json({
        status: 2,
        msg: "Tweet not found.",
      });
    }

    res.status(200).json({
      status: 0,
      msg: "Tweet content updated successfully.",
      updatedTweet,
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
