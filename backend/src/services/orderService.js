const { Order, Order_Detail, sequelize, Item } = require("../models/index");

async function get(user_id) {
  try {
    const orders = await Order.findAll({
      where: {
        user_id: user_id,
      },
      include: [Order_Detail],
    });
    if (orders.length === 0) {
      throw new Error("No orders found for the user");
    }
    return orders;
  } catch (error) {
    console.log("Error occurred while getting orders", error);
    throw new Error(error.message);
  }
}

async function create(order) {
  try {
    const datearr = order.order_date.split("-");
    const createdOrder = await Order.create({
      user_id: order.user_id,
      order_date: new Date(datearr[0], datearr[1] - 1, datearr[2]),
      total_price: order.total_price,
      total_quantity: order.total_quantity,
    });
    if (createdOrder) {
      const orderdet_all = order.orderDetails.map((order_det) => {
        return {
          order_id: createdOrder.order_id,
          item_quantity: order_det.item_quantity,
          unit_price: order_det.unit_price,
          shop_id: order_det.shop_id,
          item_name: order_det.item_name,
          item_pic: order_det.item_pic,
          category: order_det.category,
          description: order_det.description,
        };
      });

      await Promise.all([
        Order_Detail.bulkCreate(orderdet_all),
        Promise.all(
          order.orderDetails.map((order_det) =>
            Item.increment(
              {
                stock: -order_det.item_quantity,
                sold_count: order_det.item_quantity,
              },
              {
                where: {
                  item_id: order_det.item_id,
                },
              }
            )
          )
        ),
      ]);
      return `Order created successfully with OrderId:${createdOrder.order_id}`;
      // }
    }
    throw new Error("Some error occurred while creating Order");
  } catch (error) {
    console.log("Error occurred while creating Order", error);
    if (error.name && error.name === "SequelizeUniqueConstraintError") {
      throw new Error(`Order already exists`);
    }
    throw new Error(error.message);
  }
}

module.exports = { get, create };
