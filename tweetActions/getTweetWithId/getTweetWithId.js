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
    if (tweetId) {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(tweetId);
      console.log("isValidObjectId", isValidObjectId);
      if (isValidObjectId) {
        const getTweetById = await TweetModel.findById(tweetId);

        if (getTweetById) {
          const user = await UserModel.findById(getTweetById?.authorId);
          const tweetData = {
            authorName: user.fullname,
            authorUsername: user.username,
            authorProfile: user.profilepicture,
            ...getTweetById.toObject(),
          };

          // Include user details inside comments
          const commentsWithUserData = await Promise.all(
            getTweetById.comments.map(async (comment) => {
              const commentUser = await UserModel.findById(
                comment?.commentUserId
              );
              return {
                ...comment.toObject(),
                authorName: commentUser.fullname,
                authorUsername: commentUser.username,
                authorProfile: commentUser.profilepicture,
              };
            })
          );

          // Combine the tweet data with comments data
          const requiredUserData = {
            ...tweetData,
            comments: commentsWithUserData,
          };
          return res.status(200).send({
            status: 1,
            msg: "Tweet found successfully.",
            tweet: requiredUserData,
          });
        } else {
          return res.status(200).send({
            status: 2,
            msg: "We couldn't find the specific tweet. Maybe the id is incorrect or the tweet is deleted by the author.",
          });
        }
      } else {
        return res.status(200).send({
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
