const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
});

const conversationSchema = new Schema({
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const messageSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  content: String,
  createdAt: Date,
});

module.exports = {
  User: model("User", userSchema),
  Conversation: model("Conversation", conversationSchema),
  Message: model("Message", messageSchema),
};
