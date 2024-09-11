const amqp = require('amqplib/callback_api');

const sendRegisterMail = async (type, userEmail, nameSurname = null) => {
    amqp.connect(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`, (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }

            const queue = type === 'welcomeMail' ? 'welcome_emails' : 'alert_emails';
            const msg = JSON.stringify({ type, email: userEmail, name: nameSurname });

            channel.assertQueue(queue, {
                durable: false
            });

            channel.sendToQueue(queue, Buffer.from(msg));

            console.log(" [x] Sent '%s' to queue: %s", msg, queue);
        });

        setTimeout(() => {
            connection.close();
        }, 500);
    });
};

module.exports = sendRegisterMail;