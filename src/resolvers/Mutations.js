const {copyValueToObjectIfDefined, propertyExists} = require("./helper/objectHelper");
const { UserInputError } = require("apollo-server");

async function createNotification(_, args, context, info){

  if (args.email == undefined && args.online == undefined){
    throw new Error("A notification must be created with either Email or Online information")
  }

  var createNotificationData = {
    gcID: args.gcID,
    appID: args.appID,
    actionLink: copyValueToObjectIfDefined(args.actionLink),
    actionLevel: args.actionLevel
  };

  if(args.online !== undefined){
    createNotificationData.online = {
      create: {
        titleEn: args.online.titleEn,
        titleFr: args.online.titleFr,
        descriptionEn: args.online.descriptionEn,
        descriptionFr: args.online.descriptionFr
      }
    }
  }


  return await context.prisma.mutation.createNotification({
       data: createNotificationData,
       }, info);
}

module.exports = {
  createNotification
};
