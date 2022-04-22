const { kafka } = require('./kafkaClient');
const producer = kafka.producer();

(async () => {await producer.connect()})();

const sendMessage = async (message, id) => {
  try {
    //todo send callback to consumer queue
    console.log('message to be sent is',message);
    await producer.send({
      topic:process.env.RESPONSE_TOPIC,
      messages: [
        {
          value: JSON.stringify(message),
          headers: {
            id
          },
        },
      ],
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = { sendMessage };
