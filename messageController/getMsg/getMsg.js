const Router = require("express").Router();
const MessageModel = require("../../Models/MessageModel/MessageModel");
const { io } = require("../../app");
Router.get("/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    console.log("yeah");
    const allChats = await MessageModel.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    // return res.status(200).send({
    //   allMessages: allChats,
    // });
    io.emit("saveAllMessages", {
      allMessages: allChats,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      msg: "Server error",
      status: "3",
    });
  }
});

module.exports = Router;
