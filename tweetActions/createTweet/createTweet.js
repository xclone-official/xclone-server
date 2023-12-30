const TweetModel = require("../../Models/TweetModel/TweetModel");
const UserModel = require("../../Models/UserModel/UserModel");
const upload = require("../../multer/tweetmedia");
const {
  uploadOnCloudinary,
} = require("../../uploadonCloudinary/uploadOnCloudinary");

const Router = require("express").Router();

Router.get("/", (req, res) => {
  res.send({
    msg: "Success",
  });
});

Router.post("/", upload.array("tweetmedia", 2), async (req, res) => {
  try {
    const { authorId } = req.body;
    if (!authorId) {
      res.status(302).send({
        status: 3,
        msg: "Fields can't be empty.",
      });
    } else {
      const isUserExist = await UserModel.findById(authorId);
      const isAuthorIdMatched = await isUserExist._id;
      if (isUserExist) {
        if (parseInt(isAuthorIdMatched) === parseInt(authorId)) {
          const tweetContent = req.body.tweetContent || "";
          const authorId = req.body.authorId || "";
          const likes = req.body.likes || [];
          const comments = req.body.comments || [];
          const quotedTweet = req.body.quotedTweet || "";

          let images = [];
          let video = [];

          // Check if there are uploaded files
          if (req.files && req.files.length > 0) {
            for (let file of req.files) {
              const tweetMedia = await uploadOnCloudinary(file.path);

              if (!tweetMedia) return null;
              let mimeType = file.mimetype;
              if (mimeType.startsWith("image")) {
                images.push(tweetMedia.url);
              } else if (mimeType.startsWith("video")) {
                video.push(tweetMedia.url);
              }
            }
          }

          const newTweet = new TweetModel({
            tweetContent,
            authorId,
            likes,
            comments,
            quotedTweet,
            photos: images,
            video: video,
          });
          await newTweet.save();
          res.status(200).send({
            status: 1,
            msg: "Success",
            data: newTweet,
          });
        } else {
          res.status(200).send({
            status: 2,
            msg: "The given id of user doesn't match with the original id.",
          });
        }
      } else {
        res.status(200).send({
          status: 2,
          msg: "We can't find a user with this id.",
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      status: 3,
      msg: "Internal server error.",
    });
  }
});

module.exports = Router;
