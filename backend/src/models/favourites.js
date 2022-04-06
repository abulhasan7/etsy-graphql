/* eslint-disable no-undef */
module.exports = (Schema) =>
  ({
    user_id: {
      type: String,

    },
    item: {
      type: Schema.Types.ObjectId, ref: 'Item',
    },
  });
