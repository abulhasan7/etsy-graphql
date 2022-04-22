const { kafka } = require("./kafkaClient");

const consumer = kafka.consumer({ groupId: "backend-items-consumers" });

(async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.ITEMS_TOPIC,
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
