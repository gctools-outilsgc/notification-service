const { Prisma } = require("prisma-binding");

function setPrisma(){
  
  return new Prisma({
        typeDefs: "src/generated/prisma.graphql",
        endpoint: "http://localhost:4466",
      });
}

async function cleanUp(context){
    await context.prisma.mutation.deleteManyNotifications();
  }

module.exports = {
  cleanUp,
  setPrisma
};
