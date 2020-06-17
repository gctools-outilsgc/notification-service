const { ApolloServer, gql, makeExecutableSchema, PubSub, withFilter } = require("apollo-server");
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

const pubsub = new PubSub();

const server = new ApolloServer({
  schema,
  tracing: config.app.tracing,
  context: async (req) => ({
    ...req,
    prisma: new Prisma({
      typeDefs: "./src/generated/prisma.graphql",
      endpoint: "http://" + config.prisma.host + ":4466",
      debug: config.prisma.debug,
    }),
    token: await introspect.verifyToken(req),
    pubsub: pubsub,
  }),
});



server.listen().then(({ url }) => {
  // eslint-disable-next-line no-console
  console.info(`🚀 GraphQL Server ready at ${url}`);
});

// Launch process to listen to service message queue
if (config.rabbitMQ.user && config.rabbitMQ.password) {
  connectMessageQueueListener();
  connectMessageQueuePublisher();
}