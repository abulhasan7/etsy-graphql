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
    console.log(`pushing message:${message} to topic:${topic} with id:${id}`);
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

module.exports = { sendMessage };
