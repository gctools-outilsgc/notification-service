const {copyValueToObjectIfDefined, propertyExists} = require("./helper/objectHelper");
const { UserInputError } = require("apollo-server");
const emailGenerator = require("./emailGenerator.js");

async function createNotification(_, args, context, info){

  if (!propertyExists(args, "online") && !propertyExists(args, "email")){
    throw new Error("A notification must be created with either Email or Online information");
  }

  var createNotificationData = {
    gcID: args.gcID,
    appID: args.appID,
    generatedOn: await Date.now().toString(),
    modifiedOn: null,
    actionLink: copyValueToObjectIfDefined(args.actionLink),
    actionLevel: args.actionLevel
  };

  //create online notification
  if(propertyExists(args, "online")){
    createNotificationData.online = {
      create: {
        titleEn: args.online.titleEn,
        titleFr: args.online.titleFr,
        descriptionEn: args.online.descriptionEn,
        descriptionFr: args.online.descriptionFr
      }
    };
  }

  //create email notification
  if(propertyExists(args, "email")){
    createNotificationData.email = {
      from: args.email.from,
      to: args.email.to,
      subject: args.email.subject,
      body: args.email.body,
      html: args.email.html
    };

    var sendError = await emailGenerator.sendEmail(args);

    if(sendError.status !== false){
      createNotificationData.email.sendError = sendError.msg;
      createNotificationData.email.status = "Queued";
    } else {
      createNotificationData.email.status = "Sent";
    }

    createNotificationData.email = {
      create: {
        from: createNotificationData.email.from,
        to: createNotificationData.email.to,
        subject: createNotificationData.email.subject,
        body: createNotificationData.email.body,
        html: createNotificationData.email.html,
        status: createNotificationData.email.status,
        sendError: createNotificationData.email.sendError
      }
    };
  }

  //who caused the notification
  if(propertyExists(args, "whoDunIt")){
    createNotificationData.whoDunIt = {
      create: {
        gcID: args.whoDunIt.gcID,
        teamID: args.whoDunIt.teamID,
        organizationID: args.whoDunIt.organizationID
      }
    };
  }

  return await context.prisma.mutation.createNotification({
    data: createNotificationData,
  }, info);
}



async function updateNotification(_, args, context, info){

  const notification = await context.prisma.query.notification(
    {
      where:{
        id: args.id
      }
    }
  );

  if(notification === null || typeof notification == "undefined") {
    throw new UserInputError("Could not find notification with id: " + args.id);
  }

  var updateOnline = {
    modifiedOn: await Date.now().toString(),
    online: {
      update: {
        titleEn: copyValueToObjectIfDefined(args.online.titleEn),
        titleFr: copyValueToObjectIfDefined(args.online.titleFr),
        descriptionEn: copyValueToObjectIfDefined(args.online.descriptionEn),
        descriptionFr: copyValueToObjectIfDefined(args.online.descriptionFr),
        viewed: copyValueToObjectIfDefined(args.online.viewed)
      }
    }
  };

  return await context.prisma.mutation.updateNotification({
    where: {
      id: args.id
    },
    data: updateOnline,
  }, info);
}

module.exports = {
  createNotification,
  updateNotification
};
