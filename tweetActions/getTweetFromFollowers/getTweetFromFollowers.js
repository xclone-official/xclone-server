const express = require("express");
const router = express.Router();
const TweetModel = require("../../Models/TweetModel/TweetModel"); // Adjust the path as needed
const UserModel = require("../../Models/UserModel/UserModel"); // Adjust the path as needed

// Endpoint to get tweets from all followers of a user
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by userId to get the list of their followers
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followersIds = user.followers.map((follower) => follower.id);

    // Retrieve tweets from users who follow the current user
    const tweets = await TweetModel.find({ authorId: { $in: followersIds } })
      .sort({ createdAt: -1 }) // Sort by most recent tweets first
      .populate("likes")
      .populate("comments.commentLike")
      .populate("comments.commentreplies.repliesLike");

    res.status(200).json({ tweets: tweets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
