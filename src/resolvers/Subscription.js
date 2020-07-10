const { copyValueToObjectIfDefined } = require("./helper/objectHelper");

const newNotification = {
    subscribe: (payload, args, context, info) => {
        return context.prisma.subscription.notification(
            {
                where: {
                    mutation_in: ['CREATED'],
                    node: {
                        gcID: context.token.sub
                    }
                },
            },
            info,
        )
    },
}

module.exports = {
    newNotification
}