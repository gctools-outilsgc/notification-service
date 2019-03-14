const mutations = require("../src/resolvers/Mutations");
const { cleanUp, setPrisma } = require("./init/prismaTestInstance");

beforeAll(async (done) => {
    ctx ={
      prisma:await setPrisma()
    } 
    done();
});

afterAll(async (done) => {
  await cleanUp(ctx);
  done();
});

test("create notification with mandatory fields", async() => {
  const args = {
    gcID: "56gdjf743hjdn",
    appID: "079685",
    actionLevel: "Featured",
    email: {
      from: "from.email@test.ca",
      to: "to.email@test.ca",
      subject: "Test mandatory fields email subject",
      body: "Testing mandatory fields email body",
      status: "Sent"
    },
    online: {
      titleEn: "Test mandatory field online title English",
      titleFr: "Test mandatory field online title French",
      descriptionEn: "Test mandatory field online description English",
      descriptionFr: "Test mandatory field online description French",
      viewed: false
    }
  };

  const info = "{ gcID, appID, actionLevel, email { from, subject, body, status }, online { titleEn, titleFr, descriptionEn, descriptionFr, viewed } }";

  expect(
    await mutations.createNotification(parent, args, ctx, info),
  ).toMatchSnapshot();

});

test("fail notification creation based on missing gcID", async() => {
  const args = {
    appID: "079685",
    actionLevel: "Featured",
    email: {
      from: "from.email@test.ca",
      to: "to.email@test.ca",
      subject: "Test mandatory fields email subject",
      body: "Testing mandatory fields email body",
      status: "Sent"
    },
    online: {
      titleEn: "Test mandatory field online title English",
      titleFr: "Test mandatory field online title French",
      descriptionEn: "Test mandatory field online description English",
      descriptionFr: "Test mandatory field online description French",
      viewed: false
    }
  };

  const info = "{ gcID, appID, actionLevel, email { from, subject, body, status }, online { titleEn, titleFr, descriptionEn, descriptionFr, viewed } }";

  await expect(
    mutations.createNotification(parent, args, ctx, info)
  ).rejects.toThrowErrorMatchingSnapshot();

});

test("fail notification creation based on missing appID", async() => {
  const args = {
    gcID: "56gdjf743hjdn",
    actionLevel: "Featured",
    email: {
      from: "from.email@test.ca",
      to: "to.email@test.ca",
      subject: "Test mandatory fields email subject",
      body: "Testing mandatory fields email body",
      status: "Sent"
    },
    online: {
      titleEn: "Test mandatory field online title English",
      titleFr: "Test mandatory field online title French",
      descriptionEn: "Test mandatory field online description English",
      descriptionFr: "Test mandatory field online description French",
      viewed: false
    }
  };

  const info = "{ gcID, appID, actionLevel, email { from, subject, body, status }, online { titleEn, titleFr, descriptionEn, descriptionFr, viewed } }";

  await expect(
    mutations.createNotification(parent, args, ctx, info)
  ).rejects.toThrowErrorMatchingSnapshot();

});

test("fail notification creation based on missing actionLevel", async() => {
  const args = {
    gcID: "56gdjf743hjdn",
    appID: "079685",
    email: {
      from: "from.email@test.ca",
      to: "to.email@test.ca",
      subject: "Test mandatory fields email subject",
      body: "Testing mandatory fields email body",
      status: "Sent"
    },
    online: {
      titleEn: "Test mandatory field online title English",
      titleFr: "Test mandatory field online title French",
      descriptionEn: "Test mandatory field online description English",
      descriptionFr: "Test mandatory field online description French",
      viewed: false
    }
  };

  const info = "{ gcID, appID, actionLevel, email { from, subject, body, status }, online { titleEn, titleFr, descriptionEn, descriptionFr, viewed } }";

  await expect(
    mutations.createNotification(parent, args, ctx, info)
  ).rejects.toThrowErrorMatchingSnapshot();

});

test("fail notification creation based on missing email and online fields", async() => {
  const args = {
    gcID: "56gdjf743hjdn",
    appID: "079685",
    actionLevel: "Featured",
  };

  const info = "{ gcID, appID, actionLevel, email { from, subject, body, status }, online { titleEn, titleFr, descriptionEn, descriptionFr, viewed } }";

  await expect(
    mutations.createNotification(parent, args, ctx, info)
  ).rejects.toThrowErrorMatchingSnapshot();

});
