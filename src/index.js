const { ApolloServer, gql, makeExecutableSchema } = require("apollo-server-express");
const express = require("express");
const http = require("http");
const { Prisma } = require("prisma-binding");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutations");
const Subscription = require("./resolvers/Subscription");
const config = require("./config");
const AuthDirectives = require("./Auth/Directives");
const fs = require("fs");
const { connectMessageQueueListener } = require("./Service_Mesh/listener_connector");
const { connectMessageQueuePublisher } = require("./Service_Mesh/publisher_connector");
const introspect = require("./Auth/introspection");

const resolvers = {
  Query,
  Mutation,
  Subscription,
};

const typeDefs = gql`${fs.readFileSync(__dirname.concat("/schema.graphql"), "utf8")}`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    isAuthenticated: AuthDirectives.AuthenticatedDirective,
  },
  resolverValidationOptions: {
    requireResolversForResolveType: false
  }
});

const app = express();

const server = new ApolloServer({
  schema,
  tracing: config.app.tracing,
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        ...connection,
        token: connection.context.token,
        prisma: new Prisma({
          typeDefs: "./src/generated/prisma.graphql",
          endpoint: "http://" + config.prisma.host + ":4466",
          debug: config.prisma.debug,
        }),
      }
    } else {
      return {
        ...req,
        prisma: new Prisma({
          typeDefs: "./src/generated/prisma.graphql",
          endpoint: "http://" + config.prisma.host + ":4466",
          debug: config.prisma.debug,
        }),
        token: await introspect.verifyToken(req),
        //pubsub: new PubSub()
      }
    }
  },
  subscriptions: {
    onConnect: async (connectionParams, webSocket, context) => {
      const token = await introspect.verifyToken(connectionParams);
      return {
        token: token
      }
    }
  },
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  const subPath = server.subscriptionsPath;
  console.log(`Subscriptions are at ws://localhost:${PORT}${subPath}`);
});

// Launch process to listen to service message queue
if (config.rabbitMQ.user && config.rabbitMQ.password) {
  connectMessageQueueListener();
  connectMessageQueuePublisher();
}