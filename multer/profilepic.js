const multer = require("multer");
// console.log("Outer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log("first");
    cb(null, "images/profileimages");
  },
  filename: function (req, file, cb) {
    // console.log("second");
    cb(null, Date.now() + "-" + Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
