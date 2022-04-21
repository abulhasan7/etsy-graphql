const { kafka } = require("./kafkaClient");

const consumer = kafka.consumer({ groupId: "backend-users-consumers" });
const userService = require("../services/userService");
const { sendMessage } = require("./producer");

//todo wait for 
(async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.USERS_TOPIC,
    fromBeginning: true
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
    let response;
    switch (action) {
      case 'REGISTER':
        response = userService.register(messageJSON);
        break;
      case 'LOGIN':
        response = await userService.login(messageJSON);
        case 'GET':
          response = userService.get(messageJSON);
          break;
        case 'UPDATE':
          response = await userService.login(messageJSON);
        break;
      default:
        break;
    }
    sendMessage({data:response},id);
  } catch (error) {
    console.error(error);
    sendMessage({error:error.message || 'Some error occured during login'},id);
  }
};
