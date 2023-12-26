const TweetModel = require("../../Models/TweetModel/TweetModel");
const mongoose = require("mongoose");
const UserModel = require("../../Models/UserModel/UserModel");
const Router = require("express").Router();

Router.get("/", (req, res) => {
  res.send({
    msg: "Success",
  });
});

Router.get("/:tweetId", async (req, res) => {
  try {
    const { tweetId } = req.params;
    console.log("tweetId", tweetId);
    if (tweetId) {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(tweetId);
      if (isValidObjectId) {
        const getTweetById = await TweetModel.findById(tweetId);
        const allLikesid = getTweetById.likes;
        const allLikesPromises = allLikesid.map(async (e) => {
          const id = e.id;
          const user = await UserModel.findById(id);
          return user;
        });

        const allLikes = await Promise.all(allLikesPromises);
        if (getTweetById) {
          return res.status(200).send({
            status: 1,
            msg: "Tweet found successfully.",
            like: allLikes,
          });
        } else {
          return res.status(200).send({
            status: 2,
            msg: "We couldn't find the specific tweet. Maybe the id is incorrect or the tweet is deleted.",
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
    res.status(500).send({
      status: 4,
      msg: "Internal server error.",
    });
  }
});

module.exports = Router;
