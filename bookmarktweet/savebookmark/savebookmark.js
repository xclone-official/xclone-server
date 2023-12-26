const Router = require("express").Router();
const UserModel = require("../../Models/UserModel/UserModel");
const TweetModel = require("../../Models/TweetModel/TweetModel");
Router.post("/:tweetId/:userId", async (req, res) => {
  try {
    const { tweetId, userId } = req.params;
    if (!tweetId || !userId) {
      return res.status(200).send({
        status: "2",
        msg: "UserId or TweetId is undefined",
      });
    }
    const isUserExist = await UserModel.findById(userId);
    // const isTweetExist = await TweetModel.findById(tweetId);

    const isTweetExist = await TweetModel.findById(tweetId);
    // const user = await UserModel.findById(getTweetById?.authorId);

    if (!isTweetExist || !isUserExist) {
      return res.status(200).send({
        status: "2",
        msg: "User or Tweet is undefinded",
      });
    }
    const isTweetBookMarkAlreadyExist = isUserExist.bookmark.some(
      (e) => e?.tweetId === tweetId
    );

    const isOnTweeBookmarkUserIdExist = isTweetExist.bookmark.some(
      (e) => e?.userId === userId
    );

    const toSaveTweet = { tweetId: tweetId };
    if (!isTweetBookMarkAlreadyExist && !isOnTweeBookmarkUserIdExist) {
      // to bookmark
      await isUserExist.bookmark.push(toSaveTweet);
      await isTweetExist.bookmark.push({ userId: userId });
      await isUserExist.save();
      await isTweetExist.save();

      const tweetAuthor = await UserModel.findById(isTweetExist?.authorId);
      const tweetData = {
        authorName: tweetAuthor.fullname,
        authorUsername: tweetAuthor.username,
        authorProfile: tweetAuthor.profilepicture,
        ...isTweetExist.toObject(),
      };

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

      const requiredTweetData = {
        ...tweetData,
        comments: commentsWithUserData,
      };
      return res.status(200).send({
        status: 1,
        msg: "Tweet saved successfully.",
        user: isUserExist,
        tweet: requiredTweetData,
      });
    } else {
      console.log("to remove bookmark");
      isUserExist.bookmark = isUserExist.bookmark.filter(
        (e) => e.tweetId !== tweetId
      );
      isTweetExist.bookmark = isTweetExist.bookmark.filter(
        (e) => e.userId !== userId
      );
      await isUserExist.save();
      await isTweetExist.save();

      const tweetAuthor = await UserModel.findById(isTweetExist?.authorId);
      const tweetData = {
        authorName: tweetAuthor.fullname,
        authorUsername: tweetAuthor.username,
        authorProfile: tweetAuthor.profilepicture,
        ...isTweetExist.toObject(),
      };

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

      const requiredTweetData = {
        ...tweetData,
        comments: commentsWithUserData,
      };
      return res.status(200).send({
        status: 1,
        msg: "Tweet removed successfully.",
        user: isUserExist,
        tweet: requiredTweetData,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 3,
      msg: "Internal server error.",
    });
  }
});
module.exports = Router;
