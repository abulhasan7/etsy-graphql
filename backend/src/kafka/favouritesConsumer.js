const { kafka } = require("./kafkaClient");

const consumer = kafka.consumer({ groupId: "backend-favourites-consumers" });

(async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.FAVOURITES_TOPIC,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const headers = JSON.parse(message.headers.toString());
      const messageJSON = JSON.parse(message.value.toString());
      const callback = idToCallBackMap[headers.id];

    },
  });
})();
