const Router = require("express").Router();
const UserModel = require("../../Models/UserModel/UserModel");
const { sendEmail } = require("../../emailType/emailType");
Router.post("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(200).send({
        msg: "Email can't be empty",
        status: 2,
      });
    }
    const isUserExist = await UserModel.findOne({ email: email });
    if (!isUserExist) {
      return res.status(200).send({
        msg: "User can't be empty",
        status: 2,
      });
    }
    const randomSixInteger = Math.floor(Math.random() * 1000000);
    console.log(randomSixInteger);
    isUserExist.otp = randomSixInteger;
    await isUserExist.save();
    await sendEmail("send_otp", email, randomSixInteger);
    return res.status(200).send({
      msg: "OTP sent!",
      status: 1,
    });
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
      status: 3,
    });
  }
});

module.exports = Router;
