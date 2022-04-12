/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const user = require('./user');
const shop = require('./shops');
const favourite = require('./favourites');
const item = require('./items');
const order = require('./orders');

const { Schema } = mongoose;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 500,
};

mongoose.connect(process.env.mongoUrl, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log('MongoDB Connection Failed');
  } else {
    console.log('MongoDB Connected');
  }
});

const userSchema = new Schema(user);
userSchema.set('toJSON', {
  transform(doc, ret, options) {
    ret.user_id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
const shopSchema = new Schema(shop(Schema));
shopSchema.set('toJSON', {
  transform(doc, ret, options) {
    ret.shop_id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
const favSchema = new Schema(favourite(Schema));
favSchema.set('toJSON', {
  transform(doc, ret, options) {
    ret.favourite_id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
const itemSchema = new Schema(item(Schema));
itemSchema.set('toJSON', {
  transform(doc, ret, options) {
    ret.item_id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
const orderSchema = new Schema(order);
orderSchema.set('toJSON', {
  transform(doc, ret, options) {
    ret.order_id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
const User = mongoose.model('User', userSchema);
const Shop = mongoose.model('Shop', shopSchema);
const Favourite = mongoose.model('Favourite', favSchema);
const Item = mongoose.model('Item', itemSchema, 'items');
const ItemCategories = mongoose.model('ItemCategories', new Schema({ _id: { type: String }, categories: [{ type: String }] }), 'item-categories');
const Order = mongoose.model('Order', orderSchema);

module.exports = {
  User,
  Shop,
  Favourite,
  Item,
  ItemCategories,
  Order,
  mongoose,
};
