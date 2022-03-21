const { Sequelize, DataTypes } = require('sequelize');
const user = require('./user');
const country = require('./countries');
const shop = require('./shops');
const favourite = require('./favourites');
const itemCategory = require('./item_categories');
const item = require('./items');
const order = require('./orders');
const orderDetail = require('./orders_details');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
    pool: {
      min: 1,
      max: 20,
      idle: 10000,
    },
  },
);

const Country = sequelize.define('Country', country(DataTypes), {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  //   modelName: "User", // We need to choose the model name,
  tableName: 'countries',
  createdAt: false,
  updatedAt: false,

});

const User = sequelize.define('User', user(DataTypes), {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  //   modelName: "User", // We need to choose the model name,
  tableName: 'users',
  createdAt: false,
  updatedAt: false,
});

const Shop = sequelize.define('Shop', shop(DataTypes), {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  //   modelName: "User", // We need to choose the model name,
  tableName: 'shops',
  createdAt: false,
  updatedAt: false,
});

const Favourite = sequelize.define('Favourite', favourite(DataTypes), {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  //   modelName: "User", // We need to choose the model name,
  tableName: 'favourites',
  createdAt: false,
  updatedAt: false,
});

const ItemCategory = sequelize.define('Item_Category', itemCategory(DataTypes), {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  //   modelName: "User", // We need to choose the model name,
  tableName: 'item_categories',
  createdAt: false,
  updatedAt: false,
});

const Item = sequelize.define('Item', item(DataTypes), {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  //   modelName: "User", // We need to choose the model name,
  tableName: 'items',
  createdAt: false,
  updatedAt: false,
});

const Order = sequelize.define('Order', order(DataTypes), {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  //   modelName: "User", // We need to choose the model name,
  tableName: 'orders',
  createdAt: false,
  updatedAt: false,
});

const OrderDetail = sequelize.define('Order_Detail', orderDetail(DataTypes), {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  //   modelName: "User", // We need to choose the model name,
  tableName: 'orders_details',
  createdAt: false,
  updatedAt: false,
});

// All Associations
User.belongsTo(Country, { foreignKey: 'country' });
User.hasMany(Order, { foreignKey: 'user_id' });
User.hasMany(Favourite, { foreignKey: 'user_id' });
User.hasOne(Shop, { foreignKey: 'user_id' });
Shop.belongsTo(User, { foreignKey: 'user_id' });
Shop.hasMany(Item, { foreignKey: 'shop_id' });
Item.belongsTo(ItemCategory, { foreignKey: 'category', onUpdate: 'CASCADE' });
Item.belongsTo(Shop, { foreignKey: 'shop_id' });
Item.hasMany(Favourite, { foreignKey: 'item_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.hasMany(OrderDetail, { foreignKey: 'order_id' });
OrderDetail.belongsTo(Order, { foreignKey: 'order_id' });
// Order_Detail.belongsTo(Item,{foreignKey:'item_id'})
OrderDetail.belongsTo(Shop, { foreignKey: 'shop_id' });
Favourite.belongsTo(User, { foreignKey: 'user_id' });
Favourite.belongsTo(Item, { foreignKey: 'item_id' });

module.exports = {
  User,
  Shop,
  Country,
  Favourite,
  ItemCategory,
  Item,
  Order,
  OrderDetail,
  sequelize,
};
