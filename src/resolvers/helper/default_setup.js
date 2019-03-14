const config = require("../../config");
const { Prisma } = require("prisma-binding");
const mutations = require("../Mutations");
const querys = require("../Query");

const ctx = {
    prisma: new Prisma({
        typeDefs: "./src/generated/prisma.graphql",
        endpoint: "http://localhost:4466",
        //debug: config.prisma.debug,
    }) 
}; 

var defaultData = {};


async function createDefaultNotification() {

    // Create default notification

    const args = {
        gcID: "234235fdg856bdgf",
        appID: "958742",
        actionLevel: "Featured",
        email: {
          from: "fromDefault@test.ca",
          to: "toDefault@test.ca",
          subject: "Test default subject",
          body: "Testing default email body",
          status: "Sent"
        },
        online: {
          titleEn: "Default test title English",
          titleFr: "Test titre par defaut en français",
          descriptionEn: "Default Test online description English",
          descriptionFr: "Test description par defaut en ligne en français",
          viewed: false
        }
      };
    

    let notif = await mutations.createNotification({}, args, ctx, "{id}");
    
    return notif;
            
}

async function getDefaults(){
    var notif = await querys.notifications({},{gcID:"234235fdg856bdgf", appID:"958742"}, ctx, "{id}");
    if (notif.length < 1 ){
        defaultData.notif = await createDefaultNotification();
    } else {
         defaultData.notif = notif[0];
    }   

    return defaultData;
}

module.exports = {
    getDefaults
};