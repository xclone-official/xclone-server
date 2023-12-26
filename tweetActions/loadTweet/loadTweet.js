const TweetModel = require("../../Models/TweetModel/TweetModel");
const UserModel = require("../../Models/UserModel/UserModel"); // Assuming you have a UserModel

const Router = require("express").Router();

Router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).send({ status: 2, msg: "User not found" });
    }

    const followersIds = user.followers.map((follower) => follower.id);
    const followingIds = user.following.map(
      (followingUser) => followingUser.id
    );

    // Find all tweets where the authorId is not in the followers or followings
    const allTweets = await TweetModel.find({
      authorId: {
        $nin: [...followersIds, ...followingIds, userId],
      },
    });

    res.status(200).send({
      status: 1,
      msg: "Tweets retrieved successfully.",
      tweets: allTweets,
    });
  } catch (error) {
    return res.status(500).send({
      status: 2,
      msg: "Internal server error.",
    });
  }
});

module.exports = Router;
