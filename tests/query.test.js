const query = require("../src/resolvers/Query");
const { getContext, cleanUp } = require("./init/prismaTestInstance");
const parent = {};

beforeAll(async (done) => {
  ctx = await getContext();
  done();
});

afterAll(async (done) => {
  await cleanUp(ctx);
  done();
});

test("Query all notifications", async() => {
  const info = "{id, gcID, appID, actionLevel, actionLink, email{ from, to, subject, body, status, html, sendError}, online{ titleEn, titleFr, descriptionEn, descriptionFr, viewed}, whoDunIt{ gcID, teamID, organizationID}}";
  
  expect(
    await query.notifications(parent, {}, ctx, info),
  ).toMatchSnapshot();

});