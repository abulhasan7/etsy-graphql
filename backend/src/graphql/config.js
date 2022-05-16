const { buildSchema } = require('graphql');
const graphQLSchema = require('./schema');
const userService = require('../services/userService');
const shopService = require('../services/shopService');
const orderService = require('../services/orderService');
const itemService = require('../services/itemService');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(graphQLSchema);

// The root provides a resolver function for each API endpoint
const root = {
  getSignedUrl: (no, { user }) =>
    checkUserAuth(user, userService.get),
  checkShopAvailability: ({ shopName }, { user }) =>
    checkUserAuth(user, shopService.checkAvailability, shopName),
  getShopDetails: ({ shopId }, { user }) =>
    checkUserAuth(user, shopService.getDetails, shopId, user.shopId, user.userId),
  getAllOrders: (noparam, { user }) =>
    checkUserAuth(user, orderService.get, user.userId),
  createOrder: ({ orderInput }, { user }) =>
    checkUserAuth(user, orderService.create, { ...orderInput, user_id: user.userId }),
  getParamsForAddItem: (no, { user }) =>
    checkUserAuth(user, itemService.additemsgetparams),
  getAllItems: (no, { user }) =>
    checkUserAuth(user, itemService.getAllExceptShop, user.shopId, user.userId),
  login: ({ loginInput }) =>
    userService.login(loginInput),
  register: ({ registerInput }) =>
    userService.register(registerInput),
  updateProfile: ({ userInput }, { user }) =>
    checkUserAuth(user, userService.updateProfile, { ...userInput, user_id: user.userId }),
  registerShop: ({ shopInput }, { user }) =>
    checkUserAuth(user, shopService.register, { ...shopInput, user_id: user.userId }),
  updateShop: ({ shopInput }, { user }) =>
    checkUserAuth(user, shopService.update, { ...shopInput, shop_id: user.shopId }),
  addItem: ({ itemInput }, { user }) =>
    checkUserAuth(user, itemService.addItem, { ...itemInput, shop_id: user.shopId }),
  updateItem: ({ itemInput }, { user }) =>
    checkUserAuth(user, itemService.updateItem, itemInput),
};

const checkUserAuth = (userDetails, func, ...args) => {
  if (!userDetails) {
    throw new Error('No Authorization Header provided');
  }
  const re = func.apply(this, args);
  console.log('req', re);
  return re;
};
module.exports = (req, res, params) =>
  ({
    schema,
    rootValue: root,
    graphiql: true,
    // eslint-disable-next-line consistent-return
    context: { user: req.user },
  });
