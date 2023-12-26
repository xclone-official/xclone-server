const Router = require("express").Router();

Router.use("/email", require("./updateEmail/updateEmail"));

Router.use("/name", require("./updateName/updateName"));

Router.use("/password", require("./updatePassword/updatePassword"));

Router.use("/username", require("./updateUsername/updateUsername"));

Router.use("/phone", require("./updatePhone/updatePhone"));

Router.use(
  "/protected_tweets",
  require("./updateTweetsStatus/updateTweetsStatus")
);

Router.use("/country", require("./updateCountry/updateCountry"));

Router.use("/language", require("./updateLanguage/updateLanguage"));

Router.use("/gender", require("./updateGender/updateGender"));

Router.use("/dob", require("./updateDOB/updateDOB"));
Router.use("/flag", require("./updateFlag/updateFlag"));
Router.use("/allNotification", require("./allNotification/allNotification"));

Router.use(
  "/profilepicture",
  require("./updateProfilePicture/updateProfilePicture")
);
Router.use("/coverpic", require("./coverPic/coverPic"));
Router.use("/urlanddesc", require("./updateURLandDesc/updateURLandDesc"));

module.exports = Router;
