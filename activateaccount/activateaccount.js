const Router = require("express").Router();
const UserModel = require("../Models/UserModel/UserModel");
Router.get("/:uemail/:token", async (req, res) => {
  try {
    const { uemail, token } = req.params;
    const findUser = await UserModel.findOne({ email: uemail });
    if (findUser) {
      const userToken = await findUser.activateToken;
      const isUserTokenAndProvidedTokenMatched =
        parseInt(userToken) === parseInt(token);
      if (isUserTokenAndProvidedTokenMatched) {
        await UserModel.findOneAndUpdate(
          { email: uemail },
          {
            $set: {
              isActivated: true,
              activateToken: "", // Clear the activation token
            },
          }
        );

        res.status(200).send({
          status: 1,
          msg: "Account activation success",
        });
      } else {
        res.status(400).send({
          status: 0,
          msg: "Token not matched.",
        });
      }
    } else {
      res.status(400).send({
        status: 0,
        msg: "Couldn't find the user.",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Server error occured",
    });
  }
});

module.exports = Router;
