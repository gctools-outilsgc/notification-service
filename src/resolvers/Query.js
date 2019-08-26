const {copyValueToObjectIfDefined} = require("./helper/objectHelper");
const { addFragmentToInfo } = require("graphql-binding");

function notifications(_, args, context, info) {
  return context.prisma.query.notifications(
    {
      where:{
        gcID: context.token.sub,
        appID: copyValueToObjectIfDefined(args.appID),
        actionLevel:  copyValueToObjectIfDefined(args.actionLevel),
      },
      skip: copyValueToObjectIfDefined(args.skip),
      first: copyValueToObjectIfDefined(args.first),
    },
    info
  );
}

module.exports = {
  notifications
};
