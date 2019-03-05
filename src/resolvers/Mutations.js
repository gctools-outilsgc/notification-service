const {copyValueToObjectIfDefined, propertyExists} = require("./helper/objectHelper");
const { UserInputError } = require("apollo-server");

async function createNotification(_, args, context, info){

  if (!propertyExists(args, "online") && !propertyExists(args, "email")){
    throw new Error("A notification must be created with either Email or Online information")
  }

  var createNotificationData = {
    gcID: args.gcID,
    appID: args.appID,
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
    }
  }

  //create email notification
  if(propertyExists(args, "email")){
    createNotificationData.email = {
      from: args.email.from,
      to: args.email.to,
      subject: args.email.subject,
      body: args.email.body,
      html: args.email.html
    }

    const send_error = false; // TODO: Mail function that returns status of email and error if email can not be sent.

    if(send_error !== false){
      createNotificationData.email.send_error = send_error;
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
        send_error: createNotificationData.email.send_error
      }
    }
  }

  //who caused the notification
  if(propertyExists(args, "whoDunIt")){
    createNotificationData.whoDunIt = {
      create: {
        gcID: args.whoDunIt.gcID,
        teamID: args.whoDunIt.teamID,
        organizationID: args.whoDunIt.organizationID
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
