const fs = require("fs");

const { graphql } = require("graphql");

const mutations = require("../src/resolvers/Mutations");
const query = require("../src/resolvers/Query");

const { getContext, cleanUp, setPrisma } = require("./init/prismaTestInstance");
const parent = {};

const typeDefs = fs.readFileSync("src/schema.graphql", "utf8");


var ctx = {};



beforeAll(async (done) => {
    ctx = await getContext();
    done();
});

afterAll(async (done) => {
    await cleanUp(ctx);
    done();
});

test("create notification", async() => {
  const args = {
    gcID: "sde432sde",
    appID: "154879",
    actionLevel: "Featured",
    email: {
      from: "from@test.ca",
      to: "to@test.ca",
      subject: "Test email subject",
      body: "Test email body",
      status: "Sent"
    },
    online: {
      titleEn: "Test online title English",
      titleFr: "Test titre français en ligne",
      descriptionEn: "Test online description English",
      descriptionFr: "Test description français en ligne",
      viewed: false
    }
  };

  const info = "{ id, gcID, appID, actionLevel, email { from, subject, body, status }, online { titleEn, titleFr, descriptionEn, descriptionFr, viewed } }";

  expect(
    await mutations.createNotification(parent, args, ctx, info),
  ).toMatchSnapshot();

});

test("Modify Notification", async() => {
    var notificationID = await query.notifications(parent, {gcID:"56gdjf743hjdn"}, ctx, "{id}");
    var args = {
        id: notificationID[0].id,
        online: {
                titleEn:"My test edited",
                titleFr:"Mon test mondifié",
                descriptionEn:"My description edited",
                descriptionFr:"Ma description modifié",
                viewed:true
        }
    };

    const info = "{ id, online{titleEn,titleFr,descriptionEn,descriptionFr,viewed}}";

    expect(
        await mutations.updateNotification(parent, args, ctx, info)
    ).toMatchSnapshot();

});

test("Query all notifications", async() => {
    const info = "{id, gcID, appID, actionLevel, actionLink, email{ from, to, subject, body, status, html, sendError}, online{ titleEn, titleFr, descriptionEn, descriptionFr, viewed}, whoDunIt{ gcID, teamID, organizationID}}";
    
    expect(
      await query.notifications(parent, {}, ctx, info),
    ).toMatchSnapshot();
  
  });
  