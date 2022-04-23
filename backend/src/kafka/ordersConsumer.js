const { kafka } = require('./kafkaClient');

const consumer = kafka.consumer({ groupId: 'backend-orders-consumers' });
const orderService = require('../services/orderService');
const { sendMessage } = require('./producer');

(async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.ORDERS_TOPIC,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      actionHandler(message);
    },
  });
})();

const actionHandler = async (message) => {
  const action = message.headers.action.toString();
  const id = message.headers.id.toString();
  try {
    const messageJSON = JSON.parse(message.value.toString());
    console.log(
      `received message with action:${action} and message:${messageJSON}`,
    );
    let response;
    switch (action) {
      case 'CREATE':
        response = await orderService.create(messageJSON);
        break;
      case 'GET':
        response = await orderService.get(messageJSON.userId);
        break;
      default:
        break;
    }
    sendMessage({ data: response }, id);
  } catch (error) {
    console.error(error);
    sendMessage(
      {
        error:
          error.message || 'Some error occured during processing order request',
      },
      id,
    );
  }
};
