const mongoose = require("mongoose");
const TweetModel = require("../../Models/TweetModel/TweetModel");
const UserModel = require("../../Models/UserModel/UserModel");
const Router = require("express").Router();

Router.get("/", async (req, res) => {
  res.send({
    status: 3,
    msg: "Like Tweet Success",
  });
});

Router.put("/:tweetId/:userId", async (req, res) => {
  try {
    const { tweetId, userId } = req.params;
    if (!tweetId || !userId) {
      return res.status(200).send({
        status: 2,
        msg: "TweetId or userID is empty.",
      });
    }

    // check if the object id is valid
    const isValidObjectId = mongoose.Types.ObjectId.isValid(tweetId);
    const isValidObjectIdUserId = mongoose.Types.ObjectId.isValid(userId);
    if (!isValidObjectId || !isValidObjectIdUserId) {
      return res.status(200).send({
        status: 6,
        msg: "UserId or TweetId is not valid.",
      });
    }

    // Check if user exist

    const isUserExist = await UserModel.findById(userId);
    if (!isUserExist) {
      return res.status(200).send({
        status: 4,
        msg: "We can't find the user.",
      });
    }

    const isTweetExist = await TweetModel.findById(tweetId);
    if (!isTweetExist) {
      return res.status(200).send({
        status: 4,
        msg: "We can't find the tweet.",
      });
    }

    // Like Tweet

    const isLikeExist = isTweetExist.likes.find((e) => e.id.equals(userId));
    if (isLikeExist) {
      const toUnlike = isTweetExist.likes.filter(
        (e) => e.id.toString() !== userId.toString()
      );
      isTweetExist.likes = toUnlike;
      await isTweetExist.save();

      const toRemoveLikedTweet = isUserExist.likedTweet.filter(
        (e) => e.tweetId !== tweetId
      );
      isUserExist.likedTweet = toRemoveLikedTweet;
      await isUserExist.save();

      const tweetAuthor = await UserModel.findById(isTweetExist?.authorId);
      const tweetData = {
        authorName: tweetAuthor.fullname,
        authorUsername: tweetAuthor.username,
        authorProfile: tweetAuthor.profilepicture,
        ...isTweetExist.toObject(),
      };

      // Include user details inside comments
      const commentsWithUserData = await Promise.all(
        isTweetExist.comments.map(async (comment) => {
          const commentUser = await UserModel.findById(comment?.commentUserId);
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
        msg: "Tweet Unliked Success",
        tweet: requiredUserData,
      });
    } else {
      return res.status(200).send({
        status: 5,
        msg: "Tweet Already Unlike",
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
