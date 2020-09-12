const { User, Conversation, Message } = require("./mongooseSchema");
const { hash, compare } = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { PubSub, withFilter } = require("apollo-server");
const pubsub = new PubSub();

//Query handlers
const findById = async (parent, { id }) => {
  const user = await User.findById(id || parent.userId);
  if (!user) {
    throw new Error("User does not exist!");
  }
  return user;
};

const findAllUser = () => {
  return User.find({});
};

const findConversationById = async (parent, { id }) => {
  const conversation = await Conversation.findById(id).populate("messages");
  return conversation;
};

const findUserConversations = async (parent) => {
  const conversation = await Conversation.find({ users: parent.id }).populate(
    "messages"
  );
  return conversation;
};

const findConversationMessages = async (parent) => {
  const { messages } = await Conversation.findById(parent.id).populate(
    "messages"
  );
  return messages;
};

const findConversationUsers = async (parent) => {
  const { users } = await Conversation.findById(parent.id).populate("users");
  return users;
};

//
//Mutation handlers
const logUserIn = async (parent, { username, password }) => {
  const user = await User.findOne({
    username: username,
  });
  if (user) {
    const isMatched = await compare(password, user.password);
    if (isMatched) {
      const accessToken = jsonwebtoken.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRY }
      );
      Object.assign(user, { accessToken });
      return user;
    }
  }
  throw new Error("Incorrect username or password!");
};

const addNewUser = async (parent, { username, password }) => {
  const saltRounds = process.env.SALT_ROUNDS * 1;
  const user = new User({
    username: username,
    password: await hash(password, saltRounds),
  });
  return user.save();
};

const addNewConversation = async (parent, { userId, targetUserIds }) => {
  //parse target userId and user to single array
  const usersInvolved = [userId, ...targetUserIds];

  const conversationFound = await Conversation.findOne({
    users: { $all: usersInvolved },
  });
  if (conversationFound) {
    //Return conversation if found. If has messages, populate them. Else just return Conversation
    return conversationFound.messages.length
      ? conversationFound.populate("messages")
      : conversationFound;
  }
  const conversation = new Conversation({
    users: usersInvolved,
    messages: [],
  });
  return conversation.save();
};

const addNewMessage = async (parent, { userId, conversationId, content }) => {
  const conversation = await Conversation.findById(conversationId);
  if (conversation) {
    const createdAt = new Date();
    const message = await new Message({
      user: userId,
      content,
      createdAt,
    }).save();
    conversation.messages.push(message.id);
    conversation.save();
    await message.populate("user");
    pubsub.publish("messageAdded", {
      messageAdded: message,
      conversationId: conversationId,
    });
    return message;
  }
  throw new Error("Conversation does not exist!");
};

const messageSubscriber = withFilter(
  () => pubsub.asyncIterator("messageAdded"),
  ({ conversationId }, args) => {
    console.log(conversationId);
    console.log(args);
    return (conversationId === args.conversationId);
  }
);

module.exports = {
  query: {
    findById,
    findAllUser,
    findUserConversations,
    findConversationMessages,
    findConversationUsers,
    findConversationById,
  },
  mutation: {
    logUserIn,
    addNewUser,
    addNewConversation,
    addNewMessage,
  },
  subscription: {
    messageSubscriber,
  },
};
