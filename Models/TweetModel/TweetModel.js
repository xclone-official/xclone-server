const mongoose = require("mongoose");
const uuid = require("uuid");
const TweetModel = mongoose.Schema(
  {
    tweetContent: {
      type: String,
      default: "",
    },
    // authorName: {
    //   type: String,
    //   required: true,
    // },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userdata",
    },
    // authorUsername: {
    //   type: String,
    //   required: true,
    // },
    // authorProfile: {
    //   type: String,
    //   required: true,
    // },
    bookmark: [],
    likes: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "userdata",
        },
      },
    ],
    comments: [
      {
        commentId: {
          type: String,
          default: uuid.v4,
        },
        // commentUsername: {
        //   type: String,
        //   required: true,
        // },
        commentText: {
          type: String,
          required: true,
        },
        commentUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "userdata",
        },
        // commentName: {
        //   type: String,
        //   required: true,
        // },
        commenttime: {
          type: Date,
          default: Date.now(),
        },
        // commentUserProfile: {
        //   type: String,
        //   default: "",
        // },
        commentLike: [
          {
            name: {
              type: String,
              required: true,
            },
            bio: {
              type: String,
              required: true,
            },
            profile: {
              type: String,
              default: "",
            },
            username: {
              type: String,
              required: true,
            },
            userid: {
              type: String,
              required: true,
            },
          },
        ],
        commentSeen: [
          {
            type: String,
            required: true,
          },
        ],
        commentreplies: [
          {
            repliesUsername: {
              type: String,
              required: true,
            },
            repliesText: {
              type: String,
              required: true,
            },
            repliesUserId: {
              type: String,
              required: true,
            },
            repliesUserProfile: {
              type: String,
              default: "",
            },
            repliesLike: [
              {
                name: {
                  type: String,
                  required: true,
                },
                bio: {
                  type: String,
                  required: true,
                },
                profile: {
                  type: String,
                  default: "",
                },
                username: {
                  type: String,
                  required: true,
                },
                id: {
                  type: String,
                  required: true,
                },
              },
            ],
            repliesName: {
              type: String,
              required: true,
            },
            bio: {
              type: String,
              required: true,
            },
            repliesSeen: [String],
          },
        ],
      },
    ],
    photos: [
      {
        type: String,
        default: "",
      },
    ],
    tweetSeen: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userdata",
      },
    ],
    video: [
      {
        type: String,
        default: "",
      },
    ],
    quotedTweet: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("tweetdata", TweetModel);
