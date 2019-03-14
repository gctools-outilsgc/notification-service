const { Prisma } = require("prisma-binding");
const { getDefaults } = require("../../src/resolvers/helper/default_setup");

function setPrisma(){
  
  return new Prisma({
        typeDefs: "src/generated/prisma.graphql",
        endpoint: "http://localhost:4466",
      });
}


async function getContext(){
  var ctx = {};
  ctx.prisma = await new Prisma({
    typeDefs: "src/generated/prisma.graphql",
    endpoint: "http://localhost:4466",
    })

  ctx.defaults = await getDefaults(ctx);
  return ctx;
 
};

async function cleanUp(context){
    await context.prisma.mutation.deleteManyNotifications();
  }

module.exports = {
  getContext,
  cleanUp,
  setPrisma
};