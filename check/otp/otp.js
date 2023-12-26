const UserModel = require("../../Models/UserModel/UserModel");
const Router = require("express").Router();

Router.get("/:otp/:email", async (req, res) => {
  try {
    const { otp, email } = req.params;
    console.log(otp, email);

    if (!otp) {
      return res.status(201).send({
        msg: "OTP can't be empty",
        status: 2,
      });
    }
    const isUserExist = await UserModel.findOne({ email: email, otp: otp });

    if (isUserExist) {
      isUserExist.otp = "";
      await isUserExist.save();
      return res.status(200).send({
        msg: "OTP matched!",
        status: 1,
      });
    } else {
      return res.status(200).send({
        msg: "OTP didn't match!",
        status: 4,
      });
    }
  } catch (error) {
    return res.status(500).send({
      msg: "Internal Server Error",
      status: 3,
    });
  }
});

module.exports = Router;
