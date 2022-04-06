/* eslint-disable no-undef */
const {
  Order, Item,
} = require('../models/index');

async function get(userId) {
  try {
    const orders = await Order.find({
      user_id: userId,
    });
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
  try {
    const createdOrder = await Order.create({
      user_id: order.user_id,
      order_date: Date.now(),
      total_price: order.total_price,
      total_quantity: order.total_quantity,
    });
    if (createdOrder) {
      const mappedOrderDetails = order.orderDetails.map((orderDetail) =>
        ({
          order_id: createdOrder.order_id,
          item_quantity: orderDetail.quantity,
          unit_price: orderDetail.price,
          shop_id: orderDetail.shop_id,
          item_name: orderDetail.name,
          item_pic_url: orderDetail.item_pic_url,
          category: orderDetail.category,
          description: orderDetail.description,
          shop_name: orderDetail.Shop.shop_name,
          gift_description: orderDetail.gift_description,
        }));

      await Promise.all([
        OrderDetail.bulkCreate(mappedOrderDetails),
        Promise.all(
          order.orderDetails.map((orderDetail) =>
            Item.increment(
              {
                stock: -orderDetail.quantity,
                sold_count: orderDetail.quantity,
              },
              {
                where: {
                  item_id: orderDetail.item_id,
                },
              },
            )),
        ),
      ]);
      return `Order created successfully with OrderId:${createdOrder.order_id}`;
      // }
    }
    throw new Error('Some error occurred while creating Order');
  } catch (error) {
    console.error('Error occurred while creating Order', error);
    if (error.name && error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('Order already exists');
    }
    throw new Error(error.message);
  }
}

module.exports = { get, create };
