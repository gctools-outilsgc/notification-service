const fs = require("fs");
const mutations = require("../src/resolvers/Mutations");
const query = require("../src/resolvers/Query");
const { cleanUp, setPrisma } = require("./init/prismaTestInstance");
const parent = {};
const ctx = {
  prisma: setPrisma()
};

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

  const info = "{ gcID, appID, actionLevel, email { from, subject, body, status }, online { titleEn, titleFr, descriptionEn, descriptionFr, viewed } }";

  expect(
    await mutations.createNotification(parent, args, ctx, info),
  ).toMatchSnapshot();

});

test("Modify Notification", async() => {
    var notificationID = await query.notifications(parent, {gcID:"sde432sde"}, ctx, "{id}");
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

    const info = "{ online{titleEn,titleFr,descriptionEn,descriptionFr,viewed}}";

    expect(
        await mutations.updateNotification(parent, args, ctx, info)
    ).toMatchSnapshot();

});

test("Query all notifications", async() => {
    const info = "{gcID, appID, actionLevel, actionLink, email{ from, to, subject, body, status, html, sendError}, online{ titleEn, titleFr, descriptionEn, descriptionFr, viewed}, whoDunIt{ gcID, teamID, organizationID}}";
    
    expect(
      await query.notifications(parent, {}, ctx, info),
    ).toMatchSnapshot();
  
  });
  