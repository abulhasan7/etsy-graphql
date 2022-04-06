/* eslint-disable no-undef */
module.exports = (Schema) =>
  ({
    name: {
      type: String,
    },
    item_pic_url: {
      type: String,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
    // dec
      type: String,
    },
    stock: {
      type: Number,
    },
    sold_count: {
      type: Number,
    },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  });
