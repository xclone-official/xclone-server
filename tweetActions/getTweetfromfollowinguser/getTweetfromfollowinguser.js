const express = require("express");
const router = express.Router();
const TweetModel = require("../../Models/TweetModel/TweetModel");
const UserModel = require("../../Models/UserModel/UserModel");

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by userId to get the list of people they follow
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followingIds = user.following.map(
      (followedUser) => followedUser.user_id
    );
    // Retrieve tweets from users that the current user follows
    const tweets = await TweetModel.find({ authorId: { $in: followingIds } });

    res.status(200).json({ tweets: tweets });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
