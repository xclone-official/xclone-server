const UserModel = require("../Models/UserModel/UserModel"); // Assuming you have a UserModel
const mongoose = require("mongoose");

const Router = require("express").Router();

Router.get("/:userIdOrName", async (req, res) => {
  const { userIdOrName } = req.params;
  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(userIdOrName)) {
      // If userIdOrName is a valid ObjectId, assume it's an _id
      user = await UserModel.findById(userIdOrName);
    } else {
      // If not a valid ObjectId, assume it's a username
      user = await UserModel.findOne({ username: userIdOrName });
    }

    if (!user) {
      return res.status(404).send({ status: 2, msg: "User not found" });
    }

    const relevantUsers = await UserModel.find({
      $or: [
        { "likedTweet.authorId": user._id }, // Users who liked the user's tweets
        { "comments.commentUserId": user._id }, // Users who commented on the user's tweets
        // Add more conditions as needed
      ],
    });

    const relevantUserData = relevantUsers.map((relevantUser) => ({
      _id: relevantUser._id,
      name: relevantUser.fullname,
      username: relevantUser.username,
      profile: relevantUser.profilepicture,
      // Add more fields as needed
    }));

    res.status(200).send({
      status: 1,
      msg: "Users retrieved successfully.",
      tweets: relevantUserData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 5,
      msg: "Internal server error.",
    });
  }
});

module.exports = Router;
