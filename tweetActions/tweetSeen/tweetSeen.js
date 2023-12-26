const TweetModel = require("../../Models/TweetModel/TweetModel");
const UserModel = require("../../Models/UserModel/UserModel");
const mongoose = require("mongoose");
const Router = require("express").Router();

Router.patch("/:tweetId/:userId", async (req, res) => {
  try {
    const { userId, tweetId } = req.params;
    if (userId) {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
      const isValidTweetId = mongoose.Types.ObjectId.isValid(tweetId);
      if (isValidObjectId && isValidTweetId) {
        const user = await UserModel.findById(userId);
        const tweet = await TweetModel.findById(tweetId);

        if (user && tweet) {
          await TweetModel.findByIdAndUpdate(tweetId, {
            $addToSet: {
              tweetSeen: userId,
            },
          });

          return res.status(200).send({
            msg: "done",
          });
        } else {
          return res.status(400).send({
            status: 3,
            msg: "Invalid tweet ID format.",
          });
        }
      } else {
        return res.status(400).send({
          status: 3,
          msg: "Invalid tweet ID format.",
        });
      }
    } else {
      return res.status(400).send({
        status: 3,
        msg: "Tweet ID can't be empty.",
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
