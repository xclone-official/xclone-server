const TweetModel = require("../../Models/TweetModel/TweetModel");
const UserModel = require("../../Models/UserModel/UserModel");

const Router = require("express").Router();

Router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(200).send({
        msg: "UserId is empty",
        status: 2,
      });
    }
    const isUserExist = await UserModel.findById(userId);
    if (!isUserExist) {
      return res.status(200).send({
        msg: "User is null",
        status: 2,
      });
    }

    // Method 1
    let allBookmark = [];

    for (const tweet of isUserExist.bookmark) {
      const res = await TweetModel.findById(tweet.tweetId);
      allBookmark.push(res);
    }

    return res.status(200).send({
      msg: "All bookmark tweetID",
      status: 1,
      allBookmark: allBookmark,
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal server error!",
      status: 3,
    });
  }
});

module.exports = Router;
