/* eslint-disable no-unused-vars */
const createError = require('http-errors');

const express = require('express');

const path = require('path');

const logger = require('morgan');

require('dotenv').config();
const cors = require('cors');
// eslint-disable-next-line semi
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const passport = require('passport');
const graphQLSchema = require('./graphql/schema');
const userService = require('./services/userService');
const shopService = require('./services/shopService');
const orderService = require('./services/orderService');
const itemService = require('./services/itemService');

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
  console.log('checkuserauth', userDetails);
  if (!userDetails) {
    throw new Error('No Authorization Header provided');
  }
  const re = func.apply(this, args);
  console.log('req', re);
  return re;
};

const usersRouter = require('./routes/userRouter');

const shopsRouter = require('./routes/shopRouter');

const itemsRouter = require('./routes/itemRouter');

const ordersRouter = require('./routes/orderRouter');

const favouritesRouter = require('./routes/favouriteRouter');

const corsOptions = {
  origin: true,

  methods: 'GET,POST,PUT,DELETE,OPTIONS',

  credentials: true,

  optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
app.use(cors(corsOptions));
app.use(passport.initialize());
// app.use((req, res, next) => {
//   passport.authenticate('jwt', { session: false }, (error, user, info) => {
//     console.log('error', error);
//     console.log('user', user);
//     console.log('info', info);
//     console.log('in check auth');
//     console.log('req.user', req.user);
//     next();
//   });
// });
app.use((req, res, next) => {
  passport.authenticate(
    'jwt',
    { session: false, failWithError: true },
    (error, user, info) => {
      console.log('error', error);
      console.log('user', user);
      console.log('info', info);
      // console.log('in check auth', next);
      // console.log('req.user', req.user);
      req.user = user;
      next(null, user);
    // eslint-disable-next-line no-undef
    },
  )(req, res, next);
});

app.use(logger('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use('/graphql', graphqlHTTP((req, res, params) =>
  ({
    schema,
    rootValue: root,
    graphiql: true,
    // eslint-disable-next-line consistent-return
    context: { user: req.user },
  })));
app.use('/users', usersRouter);

app.use('/shops', shopsRouter);

app.use('/items', itemsRouter);

app.use('/orders', ordersRouter);

app.use('/favourites', favouritesRouter);

// catch 404 and forward to error handler

app.use((req, res, next) => {
  next(createError(404));
});

// error handler

app.use((err, req, res, next) => {
  console.log('in error handler');

  // set locals, only providing error in development

  res.locals.message = err.message;

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 400).json({ error: err.message });
});

module.exports = app;
