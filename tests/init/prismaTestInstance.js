const { Prisma } = require("prisma-binding");

const getPrismaTestInstance = () => {
  return new Prisma({
    typeDefs: "src/generated/prisma.graphql",
    endpoint: "http://:4466",
  });
};
module.exports = {
  getPrismaTestInstance,
};
