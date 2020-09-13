require("dotenv").config();
const express = require("express");
const { verify } = require("jsonwebtoken");
const { createServer } = require("http");
const { ApolloServer } = require("apollo-server-express");
const { resolvers, typeDefs } = require("./graphqlSchema");

const port = process.env.PORT || 5500;

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // const token = req.headers.authorization;
    // const { query } = req.body;
    // try {
    //   if (query && new RegExp("login|addNewUser").test(query)) return {};

    //   const claims = verify(token, process.env.JWT_SECRET);

    //   console.log(claims);
    // } catch (error) {
    //   throw new AuthenticationError(
    //     "Your session has expired!! Try login again!"
    //   );
    // }
    return {};
  },
});

server.applyMiddleware({ app, path: "/graphql" });
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port }, () => {
  console.log(`Apollo Server on http://localhost:${port}/graphql`);
});

/*
  Connect to MongoDB using Mongoose
*/
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOOSE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("connected to db: " + process.env.MONGOOSE_URI);
});
