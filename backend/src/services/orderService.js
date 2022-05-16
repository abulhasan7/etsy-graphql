/* eslint-disable no-undef */
const {
  Order, Item,
} = require('../models/index');

async function get(userId) {
  try {
    const orders = await Order.find({
      user_id: userId,
    }).exec();
    if (orders.length === 0) {
      throw new Error('No orders found for the user');
    }
    return orders;
  } catch (error) {
    console.error('Error occurred while getting orders', error);
    throw new Error(error.message);
  }
}

async function create(order) {
  console.log('order is ', order);
  try {
    const mappedOrderDetails = order.order_details.map((orderDetail) =>
      ({
        item_quantity: orderDetail.quantity,
        unit_price: orderDetail.price,
        shop_id: orderDetail.shop.shop_id,
        item_name: orderDetail.name,
        item_pic_url: orderDetail.item_pic_url,
        category: orderDetail.category,
        description: orderDetail.description,
        shop_name: orderDetail.shop.shop_name,
        gift_description: orderDetail.gift_description,
      }));
    const createdOrder = await new Order({
      user_id: order.user_id,
      order_date: Date.now(),
      total_price: order.total_price,
      total_quantity: order.total_quantity,
      order_details: mappedOrderDetails,
    }).save();
    await Promise.all([
      Promise.all(
        order.order_details.map((orderDetail) =>
          Item.updateOne(
            {
              _id: orderDetail._id,
            },
            {
              $inc: {
                stock: -orderDetail.quantity,
                sold_count: orderDetail.quantity,
              },

            },

          )),
      ),
    ]);
    return `Order created successfully with OrderId:${createdOrder.order_id}`;
    // throw new Error('Some error occurred while creating Order');
  } catch (error) {
    console.error('Error occurred while creating Order', error);
    if (error.name && error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('Order already exists');
    }
    throw new Error(error.message);
  }
}

module.exports = { get, create };
