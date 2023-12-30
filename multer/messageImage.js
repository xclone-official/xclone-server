const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/messageimages");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
