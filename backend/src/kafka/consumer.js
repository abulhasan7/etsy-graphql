const { kafka } = require("./kafkaClient");

const consumer = kafka.consumer({ groupId: "middleware-consumers" });

(async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.RESPONSE_TOPIC,
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const headers = JSON.parse(message.headers.toString());
      const messageJSON = JSON.parse(message.value.toString());
      const callback = idToCallBackMap[headers.id];
      if (messageJSON.data) {
        callback(null, messageJSON.data);
      } else {
        callback(messageJSON.error, null);
      }
    },
  });
})();
const idToCallBackMap = {};

const addCallBacktoCallBackMap = async (id, callback) => {
  const tId = setInterval(
    () => {
      delete idToCallBackMap.id;
    },
    id,
    process.env.RESPONSE_WAIT_TIMEOUT
  );
  idToCallBackMap.id = { callback, tId };
};

module.exports = { addCallBacktoCallBackMap };
