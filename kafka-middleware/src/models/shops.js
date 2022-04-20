/* eslint-disable no-undef */
module.exports = (Schema) =>
  ({
    _id: {
      type: Schema.Types.ObjectId,
      alias: 'shop_id',
    },
    shop_name: {
      type: String,
    },
    shop_pic_url: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId, ref: 'User',
    },
  });
