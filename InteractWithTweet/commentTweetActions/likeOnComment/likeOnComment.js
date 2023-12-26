const TweetModel = require("../../../Models/TweetModel/TweetModel");
const UserModel = require("../../../Models/UserModel/UserModel");

const Router = require("express").Router();

Router.post("/", async (req, res) => {
  try {
    const { tweetId, commentId, userId } = req.body;
    if (!tweetId || !commentId || !userId) {
      return res.status(400).json({
        status: 3,
        msg: "tweetId, commentId, or userId is missing in the request.",
      });
    }

    // Check if the tweet and comment exist using a single query
    const isTweetExist = await TweetModel.findOne({
      _id: tweetId,
      "comments._id": commentId,
    });
    if (!isTweetExist) {
      return res.status(404).json({
        status: 2,
        msg: "Tweet or Comment doesn't exist.",
      });
    }

    // Check if the user exists
    const isUserExist = await UserModel.findById(userId);

    if (!isUserExist) {
      return res.status(404).json({
        status: 2,
        msg: "User doesn't exist.",
      });
    }

    const likeDataJson = {
      name: isUserExist.fullname,
      bio: isUserExist.bio,
      profile: isUserExist.profilepicture,
      userid: isUserExist._id,
      username: isUserExist.username,
    };
    const comment = isTweetExist.comments.filter((c) =>
      c._id.equals(commentId)
    );
    // Check if userId ies not already in the commentSeen array
    // console.log(comment[0]);
    // Check if the user has already liked the comment
    const isLiked = comment[0].commentLike.some(
      (like) => like.userid === userId
    );

    if (!isLiked) {
      // If the user hasn't liked the comment, add the like
      comment[0].commentLike.push(likeDataJson);
      await isTweetExist.save();
      return res.status(200).json({
        status: 1,
        msg: "Tweet Liked.",
      });
    }

    return res.status(200).json({
      status: 1,
      msg: "Tweet Already Liked.",
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
