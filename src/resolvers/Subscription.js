
const { PubSub, withFilter } = require('apollo-server');

const pubsub = new PubSub();

const NEW_NOTIFICATION_TOPIC = 'new_notification';

const newNotification = {
    subscribe: (payload, args, context, info) => {
        return context.prisma.subscription.notification(
            {
                where: {
                    mutation_in: ['CREATED', 'UPDATED'],
                },
            },
            info,
        )
    },
}

module.exports = {
    newNotification
}