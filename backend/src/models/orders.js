module.exports = {

  order_date: {
    type: Date,
  },
  user_id: {
    type: Number,
  },
  total_price: {
    // dec
    type: String,
  },
  total_quantity: {
    type: Number,
  },
  order_details: [
    {
      order_id: {
        type: Number,
      },

      item_quantity: {
        type: Number,
      },
      unit_price: {
        // dec
        type: String,
      },
      shop_id: {
        type: Number,
      },
      item_name: {
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
      shop_name: {
        type: String,
      },
      gift_description: {
        type: String,
      },
    },
  ],
};
