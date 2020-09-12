const { gql } = require("apollo-server-express");
const { query, mutation, subscription } = require("./resolvers");

const typeDefs = gql`
  type User {
    id: ID
    username: String
    password: String
    name: String
    accessToken: String
    conversations: [Conversation]
  }

  type Message {
    id: ID
    content: String
    createdAt: String
    user: User
  }

  type Conversation {
    id: ID
    messages: [Message]
    users: [User]
  }

  type Query {
    user(id: ID!): User
    users: [User]
    conversation(id: ID!): Conversation
  }

  type Mutation {
    login(username: String!, password: String!): User
    addNewUser(username: String!, password: String!, name: String!): User
    addNewConversation(userId: ID!, targetUserIds: [ID]!): Conversation
    addNewMessage(userId: ID!, conversationId: ID!, content: String!): Message
  }

  type Subscription {
    messageAdded(conversationId: ID!): Message
  }
`;

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
//Schema defines data on the Graph like object types(book type), relation between
//these object types and describes how it can reach into the graph to interact with
//the data to retrieve or mutate the data
// const UserType = new GraphQLObjectType({
//   name: "User",
//   fields: () => ({
//     id: { type: GraphQLID },
//     username: { type: GraphQLString },
//     password: { type: GraphQLString },
//     accessToken: { type: GraphQLString },
//     conversations: {
//       type: new GraphQLList(ConversationType),
//       resolve: query.findUserConversations,
//     },
//   }),
// });

// const MessageType = new GraphQLObjectType({
//   name: "Message",
//   fields: () => ({
//     id: { type: GraphQLID },
//     content: { type: GraphQLString },
//     createdAt: { type: GraphQLString },
//     user: { type: UserType },
//   }),
// });

// const ConversationType = new GraphQLObjectType({
//   name: "Conversation",
//   fields: () => ({
//     id: { type: GraphQLID },
//     messages: {
//       type: new GraphQLList(MessageType),
//       resolve: query.findConversationMessages,
//     },
//     users: {
//       type: new GraphQLList(UserType),
//       resolve: query.findConversationUsers,
//     },
//   }),
// });

// const Subscription = new GraphQLObjectType({
//   name: "Subscription",
//   fields: {
//     messageAdded: {
//       type: MessageType,
//       args: {
//         conversationId: { type: GraphQLID },
//       },
//       subscribe: subscription.messageSubscriber,
//     },
//   },
// });

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular book
//or get a particular author.
// const RootQuery = new GraphQLObjectType({
//   name: "RootQueryType",
//   fields: {
//     user: {
//       type: UserType,
//       args: {
//         id: { type: GraphQLID },
//       },
//       resolve: query.findById,
//     },
//     users: {
//       type: new GraphQLList(UserType),
//       resolve: query.findAllUser,
//     },
//     conversation: {
//       type: ConversationType,
//       args: {
//         id: { type: GraphQLID },
//       },
//       resolve: query.findConversationById,
//     },
//   },
// });

//Help update, add to database
// const Mutation = new GraphQLObjectType({
//   name: "Mutation",
//   fields: {
//     login: {
//       type: UserType,
//       args: {
//         username: { type: GraphQLNonNull(GraphQLString) },
//         password: { type: GraphQLNonNull(GraphQLString) },
//       },
//       resolve: mutation.logUserIn,
//     },
//     addNewUser: {
//       type: UserType,
//       args: {
//         username: { type: GraphQLNonNull(GraphQLString) },
//         password: { type: GraphQLNonNull(GraphQLString) },
//       },
//       resolve: mutation.addNewUser,
//     },
//     addNewConversation: {
//       type: ConversationType,
//       args: {
//         userId: { type: GraphQLNonNull(GraphQLString) },
//         targetUserIds: { type: new GraphQLList(GraphQLString) },
//       },
//       resolve: mutation.addNewConversation,
//     },
//     addNewMessage: {
//       type: MessageType,
//       args: {
//         userId: { type: GraphQLNonNull(GraphQLString) },
//         conversationId: { type: GraphQLNonNull(GraphQLString) },
//         content: { type: GraphQLNonNull(GraphQLString) },
//       },
//       resolve: mutation.addNewMessage,
//     },
//   },
// });

//Creating a new GraphQL Schema, with options query which defines query
//we will allow users to use when they are making request.
// module.exports = new GraphQLSchema({
//   query: RootQuery,
//   mutation: Mutation,
//   subscription: Subscription,
// });
