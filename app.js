const express = require("express");
const app = express();
const { users, getUser, removeUser, addNewUser } = require("./userStore");
// Connection
const axios = require("axios");
require("./connection/conn");
require("dotenv").config();
const FRONTEND_WEBSITE = process.env.FRONTEND_WEBSITE;
const cors = require("cors");
const httpServer = require("http").createServer(app);
express.json();
express.urlencoded({ extended: true });
const io = require("socket.io")(httpServer, {
  cors: {
    origin: FRONTEND_WEBSITE,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
module.exports = { io };
io.on("connection", (socket) => {
  socket.on("connection", () => {
    console.log("Someone is connected");
  });

  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
  });
  // Follow socket
  socket.on(
    "sendFollowNotification",
    async ({ senderUsername, receiverUsername, tweet, type }) => {
      const senderUser = await UserModel.findOne({ username: senderUsername });
      const receiverUser = await UserModel.findOne({
        username: receiverUsername,
      });
      const receiveUser = getUser(receiverUsername);
      if (senderUser && receiverUser && receiveUser) {
        const dataToPush = {
          authorName: senderUser.fullname,
          authorId: senderUser._id,
          authorUsername: senderUsername,
          authorProfile: senderUser.profilepicture,
          tweet: tweet,
          type: type,

          isSeen: false, // You can set this property accordingly
        };

        if (
          !receiverUser.allNotifications.some(
            (e) =>
              e.authorUsername === senderUsername && e.type === dataToPush.type
          )
        ) {
          receiverUser.allNotifications.push(dataToPush);
          await receiverUser.save();
          io.to(receiveUser.socketId).emit("followed", dataToPush);
          console.log("receiveUser.socketId", receiveUser.socketId);
        } else {
          console.log("Notification already exists");
        }
      } else {
        console.log("User not found");
      }
    }
  );
  // Like
  socket.on(
    "sendLikeNotification",
    async ({ senderUsername, receiverUsername, tweet, type, tweetId }) => {
      const senderUser = await UserModel.findOne({ username: senderUsername });
      const receiverUser = await UserModel.findOne({
        username: receiverUsername,
      });
      const receiveUser = getUser(receiverUsername);
      console.log("userss", users);
      console.log("receiveUser", receiveUser);
      if (senderUser && receiverUser && receiveUser) {
        const dataToPush = {
          authorName: senderUser.fullname,
          authorId: senderUser._id,
          authorUsername: senderUsername,
          authorProfile: senderUser.profilepicture,
          type: type,
          tweet: tweet,
          tweetId: tweetId,
          isSeen: false, // You can set this property accordingly
        };

        if (
          !receiverUser.allNotifications.some(
            (e) =>
              e.authorUsername === senderUsername &&
              e.type === dataToPush.type &&
              e?.tweet?._id === tweetId
          )
        ) {
          receiverUser.allNotifications.push(dataToPush);
          await receiverUser.save();

          console.log("receiveUser.socketId", receiveUser.socketId);
        } else {
          console.log("Notification already exists");
        }
        io.to(receiveUser.socketId).emit("likedtweet", dataToPush);
        console.log("Can't add to db");
      } else {
        console.log("User not found");
      }
    }
  );
  // reply
  socket.on(
    "sendRepliesNotification",
    async ({
      senderUsername,
      receiverUsername,
      tweet,
      type,
      tweetId,
      commentText,
    }) => {
      const senderUser = await UserModel.findOne({ username: senderUsername });
      const receiverUser = await UserModel.findOne({
        username: receiverUsername,
      });
      const receiveUser = getUser(receiverUsername);
      console.log("userss", users);
      console.log("receiveUser", receiveUser);
      if (senderUser && receiverUser && receiveUser) {
        const dataToPush = {
          authorName: senderUser.fullname,
          authorId: senderUser._id,
          authorUsername: senderUsername,
          authorProfile: senderUser.profilepicture,
          type: type,
          tweet: tweet,
          tweetId: tweetId,
          commentText: commentText,
          isSeen: false, // You can set this property accordingly
        };
        console.log(senderUsername, receiverUsername);
        if (senderUsername === receiverUsername) {
          console.log("Can't add to db,", senderUsername, receiverUsername);
        } else {
          receiverUser.allNotifications.push(dataToPush);
          await receiverUser.save();

          console.log("receiveUser.socketId", receiveUser.socketId);

          io.to(receiveUser.socketId).emit("replytweet", dataToPush);
        }
      } else {
        console.log("User not found");
      }
    }
  );
  // Message
  socket.on(
    "saveAllMessages",
    async ({ senderusername, senderId, receiverId }) => {
      const receiveUser = getUser(senderusername);
      if ((senderId, receiveUser, receiverId)) {
        const allChats = await MessageModel.find({
          $or: [
            { senderId: senderId, receiverId: receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        });
        io.to(receiveUser?.socketId).emit("setAllMsg", allChats);
      } else {
        // console.log("Can't get msg");
      }
    }
  );

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });

  // AddMsg socket
  socket.on("addMsg", async (fd) => {
    const { senderId, senderUsername, receiverId, message, file } = fd;
    console.log(senderId, senderUsername, receiverId, message);
    if (senderId && senderUsername && receiverId && message) {
      const senderUser = getUser(senderUsername);
      const receiverUser = await UserModel.findById(receiverId);
      // if (file) console.log(Buffer.isBuffer(file));
      if (receiverUser) {
        const getReceiverUser = getUser(receiverUser?.username);

        if (senderUser) {
          const newChat = await MessageModel({
            senderId,
            receiverId,
            message,
            file,
          });
          await newChat.save();

          const AllMsg = await MessageModel.find({
            $or: [
              { senderId: senderId, receiverId: receiverId },
              { senderId: receiverId, receiverId: senderId },
            ],
          });
          if (getReceiverUser) {
            // Recipient is online, broadcast immediately
            io.to(getReceiverUser.socketId).emit("sendAddMsg", AllMsg);
          }

          // Broadcast to sender and recipient (if online) for a chat history update

          io.to(senderUser?.socketId).emit("sendAddMsg", AllMsg);
        } else {
          console.log("Can't find user1");
        }
      } else {
        console.log("Can't find user2");
      }
    } else {
      console.log("Can't add msg");
    }
  });
});

const PORT = process.env.PORT;

const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const UserModel = require("./Models/UserModel/UserModel");
const MessageModel = require("./Models/MessageModel/MessageModel");
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

const corsOptions = {
  origin: FRONTEND_WEBSITE, // ReactJS URL
};

app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_WEBSITE);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.get("/", (req, res) => {
  res.send({
    msg: "Working",
  });
});

// Necessary Routes
// User actions routes
app.use("/user/auth", require("./auth/auth"));

// handle message
app.use("/api/message", require("./messageController/messageController"));
// Tweet actions
app.use("/tweetaction", require("./tweetActions/tweetActions"));

// activate account
app.use("/activateAccount", require("./activateaccount/activateaccount"));

// User relationships
app.use(
  "/relationship",
  require("./userRelationshipApis/userRelationshipApis")
);

// relevantPeople
app.use("/relevantPeople", require("./relevantPeople/getRelevantPeople"));

// Like And Unlike Tweet

app.use("/tweetinteractions", require("./InteractWithTweet/interactwithtweet"));

// bookmark tweet
app.use("/bookmark", require("./bookmarktweet/bookmarktweet"));

// Update User profile

app.use("/update", require("./updateUserInfo/updateUserInfo"));

// Send Email

app.use("/send-email", require("./sendEmail/sendEmail"));

// People actions

app.use("/peopleaction", require("./people_actions/people_actions"));

// Login with Github

app.use("/login/oauth/access_token", async (req, res) => {
  try {
    // res.send({ msg: "Success" });
    const { client_id, client_secret, code } = req.body;
    const response = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: client_id,
        client_secret: client_secret,
        code: code,
      }
    );
    console.log(response.data);
    const access_token = new URLSearchParams(response.data).get("access_token");
    return res.send({ res: access_token });
  } catch (error) {
    console.log("error", error);
  }
});
const getEmail = async (access_token) => {
  try {
    const response = await axios.get(`https://api.github.com/user/emails`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const selectedArray = response.data.filter(
      (item) => item.primary === true && item.verified === true
    );
    return selectedArray[0].email;
  } catch (error) {
    console.log(error);
  }
};
app.use("/github/getUser/:access_token", async (req, res) => {
  try {
    // res.send({ msg: "Success" });
    const { access_token } = req.params;
    const response = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const email = getEmail(access_token);
    return res.send({ res: response.data, email: email });
  } catch (error) {
    console.log("error", error);
  }
});

// Check password, email
app.use("/check", require("./check/check"));

// get people

app.use("/getPeople", require("./people_actions/people_actions"));

httpServer.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
