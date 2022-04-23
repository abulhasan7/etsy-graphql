const { kafka } = require('./kafkaClient');

const consumer = kafka.consumer({ groupId: 'backend-shops-consumers' });
const shopService = require('../services/shopService');
const { sendMessage } = require('./producer');

(async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.SHOPS_TOPIC,
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
    console.log(`received message with action:${action} and message:${messageJSON}`);
    let response;
    switch (action) {
      case 'CHECK':
        response = await shopService.checkAvailability(messageJSON);
        break;
      case 'GET':
        response = await shopService.getDetails(
          messageJSON.shopId,
          messageJSON.isOwner,
          messageJSON.userId,
        );
        break;
      case 'REGISTER':
        response = await shopService.register(messageJSON);
        break;
      case 'UPDATE':
        response = await shopService.update(messageJSON);
        break;
      default:
        break;
    }
    sendMessage({ data: response }, id);
  } catch (error) {
    console.error(error);
    sendMessage(
      { error: error.message || 'Some error occured during processing shop request' },
      id,
    );
  }
};
