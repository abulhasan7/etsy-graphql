const { kafka } = require("./kafkaClient");

const consumer = kafka.consumer({ groupId: "backend-items-consumers" });
const itemService = require('../services/itemService');
const { sendMessage } = require("./producer");

(async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.ITEMS_TOPIC,
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
      `received message with action:${action} and message:${messageJSON}`
    );
    let response;
    switch (action) {
      case "GET-ALL-EXC-SHOP":
        response = await itemService.getAllExceptShop(messageJSON.shopId,messageJSON.userId);
        break;
      case "GET-ALL-FOR-SHOP":
        response = await itemService.getAllForShop(messageJSON.shopId);
        break;
      case 'ADD':
        response = await itemService.addItem(messageJSON);
        break;
      case 'UPDATE':
        response = await itemService.updateItem(messageJSON);
        break;
      case 'ADD-ITEMS-GET-PARAMS':
        response = await itemService.additemsgetparams();
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
          error.message || "Some error occured during processing items request",
      },
      id
    );
  }
};
