const UserModel = require("../../Models/UserModel/UserModel");

const Router = require("express").Router();

Router.post("/:myId/:otherUserId", async (req, res) => {
  try {
    const { myId, otherUserId } = req.params;
    const user = await UserModel.findById(myId);
    const otherUser = await UserModel.findById(otherUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if otherUserId is already in userHasChatted
    const alreadyChatted = otherUser.userHasChatted.some(
      (chattedUser) => chattedUser.user_id.toString() === myId
    );
    const alreadyChattedOther = user.userHasChatted.some(
      (chattedUser) => chattedUser.user_id.toString() === otherUserId
    );
    if (!alreadyChatted || !alreadyChattedOther) {
      // If otherUserId is not already in userHasChatted, add it

      if (!otherUser) {
        return res.status(404).json({ message: "Other user not found" });
      }
      // Add otherUser's information to my profile's userHasChatted

      user.userHasChatted.push({
        user_id: otherUser._id,
      });
      // Add otherUser's information to other profile's userHasChatted
      otherUser.userHasChatted.push({
        user_id: user._id,
      });
      // Save the user document with the updated userHasChatted
      await user.save();
      await otherUser.save();
    }
    const myProfile = await UserModel.findById(myId);
    return res.status(200).send({
      data: myProfile,
      status: 1,
      message: "UserHasChatted updated successfully",
    });
  } catch (error) {
    return res.status(500).send({
      status: 3,
      msg: "Internal server error",
    });
  }
});

module.exports = Router;
