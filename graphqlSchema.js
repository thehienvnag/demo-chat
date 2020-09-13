const { query, mutation, subscription } = require("./resolvers");
const { typeDefs } = require("./typeDefs");

const resolvers = {
  Query: {
    user: query.findById,
    users: query.findAllUser,
    conversation: query.findConversationById,
  },
  User: {
    conversations: query.findUserConversations,
  },
  Conversation: {
    messages: query.findConversationMessages,
    users: query.findConversationUsers,
  },
  Mutation: {
    login: mutation.logUserIn,
    addNewUser: mutation.addNewUser,
    addNewConversation: mutation.addNewConversation,
    addNewMessage: mutation.addNewMessage,
  },
  Subscription: {
    messageAdded: {
      subscribe: subscription.messageSubscriber,
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
