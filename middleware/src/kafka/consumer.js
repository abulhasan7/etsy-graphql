/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const { kafka } = require('./kafkaClient');

const consumer = kafka.consumer({ groupId: 'middleware-consumers' });
const idToCallBackMap = {};

(async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.RESPONSE_TOPIC,
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      responseHandler(message);
    },
  });
})();

const addCallBacktoCallBackMap = async (id, callback) => {
  const tId = setTimeout(
    () => {
      callback('Request Timeout, Please try again!', null);
      delete idToCallBackMap.id;
    },
    process.env.RESPONSE_WAIT_TIMEOUT,
    id,
  );
  idToCallBackMap[id] = { callback, tId };
};

const responseHandler = async (message) => {
  const id = message.headers.id.toString();
  try {
    const messageJSON = JSON.parse(message.value.toString());
    console.log('id from header is ', id);
    // console.log('maps is',idToCallBackMap);
    console.error('messagejson is', messageJSON);
    const entry = idToCallBackMap[id];
    if (entry) {
      if (messageJSON.data) {
        entry.callback(null, messageJSON.data);
      } else {
        entry.callback(messageJSON.error, null);
      }
      delete idToCallBackMap.id;
      clearTimeout(entry.tId);
    } else {
      console.error('response received after slo', messageJSON);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { addCallBacktoCallBackMap };
