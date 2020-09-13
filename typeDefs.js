const { gql } = require("apollo-server-express");
module.exports = {
  typeDefs: gql`
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
      user: ID
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
  `,
};
