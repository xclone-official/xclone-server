const TweetModel = require("../../Models/TweetModel/TweetModel");

const Router = require("express").Router();

Router.get("/", (req, res) => {
  res.send({
    msg: "Success",
  });
});

Router.delete("/:tweetid", async (req, res) => {
  try {
    const { tweetid } = req.params;
    if (tweetid) {
      const isTweetExist = await TweetModel.findById(tweetid);
      if (isTweetExist) {
        await TweetModel.findByIdAndDelete(tweetid);

        const remainingTweet = await TweetModel.find();
        res.status(200).send({
          status: 1,
          msg: "Successfully Deleted",
          tweetLength: remainingTweet.length,
          remainingTweet: remainingTweet,
        });
      } else {
        res.status(200).send({
          status: 3,
          msg: "We couldn't find the tweet. Maybe the tweet is deleted or doesn't exists.",
        });
      }
    } else {
      res.status(200).send({
        status: 3,
        msg: "Tweet id can't be empty.",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 3,
      msg: "Internal server error.",
    });
  }
});

module.exports = Router;
