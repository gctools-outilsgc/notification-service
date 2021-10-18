// Handler for messages from different exchanges and keys
const { Prisma } = require("prisma-binding");
const { createNotification } = require("../resolvers/Mutations");
const { GraphQLError } = require("graphql");
const { publishMessageQueue } = require("./publisher_connector");
const config = require("../config");

const context = {
    prisma: new Prisma({
        typeDefs: "./src/generated/prisma.graphql",
        endpoint: "http://" + config.prisma.host + ":4466/",
        debug: config.prisma.debug,
    }),
};

async function msgHandler(msg, success) {
    const messageBody = JSON.parse(msg.content.toString());
    context.defaults = "";
    switch (msg.fields.routingKey) {
        case "profile.notification":
            var args = {
                gcID: String(messageBody.gcID),
                appID: messageBody.appID,
                actionLevel: messageBody.actionLevel,
                online: {
                    titleEn: messageBody.online.titleEn,
                    titleFr: messageBody.online.titleFr,
                    descriptionEn: messageBody.online.descriptionEn,
                    descriptionFr: messageBody.online.descriptionFr
                },
                whoDunIt: {
                    gcID: messageBody.whoDunIt.gcID,
                    teamID: messageBody.whoDunIt.teamID,
                    organizationID: messageBody.whoDunIt.organizationID
                },
            };
            if (config.email.host && config.email.port && config.email.email && config.email.password) {
                args.email = {
                    to: messageBody.email.to,
                    from: messageBody.email.from,
                    subject: messageBody.email.subject,
                    body: messageBody.email.body,
                    html: messageBody.email.html
                }
            }
            context.token = {
                sub: args.gcID.toString()
            };
            try {
                await createNotification(null, args, context, "{gcID, appID, actionLevel, email {to, from, subject, body, html}, online {titleEn, titleFr, descriptionEn, descriptionFr}, whoDunIt {gcID, teamID, organizationID}}");
                success(true);
            } catch (err) {
                if (err instanceof GraphQLError) {
                    console.log(err);
                    success(true);
                } else {
                    console.log(err);
                    success(false);
                }
            }
            break;

        // List cases here for topic keys being listened to.
        // see example folder for more details





        // A default case that handles errors and centralizes reporting
        default:
            let rejectMsg = {
                msg: messageBody,
                key: msg.fields.routingKey,
                error: "No handler method available"
            };
            try {
                await publishMessageQueue("errors", "profile.noHandler", rejectMsg);
            } catch (err) {
                // Could not forward error - will need to cache these
                // eslint-disable-next-line no-console
                console.error(err);
            }
            // eslint-disable-next-line no-console
            console.error("No handler method available - Default Policy : Drop to error");
            success(true);
            break;
    }
}

module.exports = {
    msgHandler
};