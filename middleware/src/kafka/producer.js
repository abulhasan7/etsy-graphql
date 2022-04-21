const uuid = require('uuid').v4;
const { kafka } = require('./kafkaClient');
const {addCallBacktoCallBackMap} = require('./consumer');

const producer = kafka.producer();

(async () => {await producer.connect()})();

const sendMessage = async (topic, message, action, callback) => {
  try {
    //todo send callback to consumer queue
    const id = uuid();
    await addCallBacktoCallBackMap(id,callback);
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
          headers: {
            id,
            action: action,
          },
        },
      ],
    });
  } catch (e) {
    console.error(e);
  }
};

// const consumer = kafka.consumer({ groupId: "response-listeners" });
// await consumer.connect();
// await consumer.subscribe({ topic: "user", fromBeginning: true });

// await consumer.run({
//   eachMessage: async ({ topic, partition, message }) => {
//     console.log(
//       JSON.parse(message.value.toString(), message.headers.toString())
//     );
//   },
// });
// await producer.disconnect();
module.exports = { sendMessage };
