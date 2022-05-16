/* eslint-disable no-unused-vars */
const createError = require('http-errors');

const express = require('express');

const path = require('path');

const logger = require('morgan');

require('dotenv').config();

const cors = require('cors');

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const userService = require('./services/userService');
const shopService = require('./services/shopService');
const orderService = require('./services/orderService');
const itemService = require('./services/itemService');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`

  type SignedUrl{
      upload_s3_url:String,
  }

  type User{
    fullname:String,
    email:String,
    phone:String,
    gender:String,
    dob:String,
    about:String,
    profile_pic_url:String,
    address_1:String,
    address_2:String,
    city:String,
    country:String
    user_id:String
  }
  input UserInput{
    fullname:String,
    email:String,
    phone:String,
    gender:String,
    dob:String,
    about:String,
    profile_pic_url:String,
    address_1:String,
    address_2:String,
    city:String,
    country:String
    user_id:String
  }
  type Shop{
    shop_id:String,
    shop_name:String,
    shop_pic_url:String,
    user:User
  }

  type Item{
    name:String,
    item_pic_url:String,
    category:String,
    description:String,
    price:String,
    stock:Int,
    sold_count:Int,
    shop:Shop,
  }
  input ItemInput{
    name:String,
    item_pic_url:String,
    category:String,
    description:String,
    price:String,
    stock:Int,
    sold_count:Int,
    shop:String,
    item_id:String
  }
  type ShopDetails{
    items:[Item],
    shop:Shop,
    upload_s3_url:String
  }
  type OrderDetails{
    item_quantity:Int,
    unit_price:String,
    shop_id:String,
    item_name:String,
    item_pic_url:String,
    category:String,
    description:String,
    shop_name:String,
    gift_description:String,

  }
  type Order{
    order_date:String,
    user_id:String,
    total_price:String,
    total_quantity:Int,
    order_details: [OrderDetails]
  }
  type Category{
    categories:[String]
  }
  type AddItemParams{
    categories:Category
    s3_upload_url:String
  }
  type ItemFavourite{
    itemId:String,
    favId:String
  }
  type ItemsWFavourites{
    items:[Item]
    favourites:[ItemFavourite]
  }

  type Query {
    getSignedUrl:SignedUrl,
    checkShopAvailability(shopName:String!):String,
    getShopDetails(shopId:String):ShopDetails,
    getAllOrders(userId:String):[Order],
    getParamsForAddItem:AddItemParams,
    getAllItems(shopId:String,userId:String):ItemsWFavourites,
  }

  input AuthInput{
    email:String,
    password:String,
    fullname:String
  }
  type LoginOutput{
    token:String,
    profile:User
  }
  type RegisterOutput{
    token:String
  }
  input ShopInput{
    shop_name:String,
    user_id:String
    shop_id:String,
    shop_pic_url:String
  }
  type Mutation{
    login(loginInput:AuthInput):LoginOutput,
    register(registerInput:AuthInput):RegisterOutput,
    updateProfile(userInput:UserInput):String,
    registerShop(shopInput:ShopInput):String,
    updateShop(shopInput:ShopInput):String,
    addItem(itemInput:ItemInput):String
    updateItem(itemInput:ItemInput):String
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  getSignedUrl: () =>
    userService.get(),
  checkShopAvailability: async ({ shopName }) =>
    shopService.checkAvailability(shopName),
  getShopDetails: ({ shopId }) =>
    shopService.getDetails(shopId, true),
  getAllOrders: ({ userId }) =>
    orderService.get(userId),
  getParamsForAddItem: () =>
    itemService.additemsgetparams(),
  getAllItems: ({ shopId, userId }) =>
    itemService.getAllExceptShop(shopId, userId),
  login: ({ loginInput }) =>
    userService.login(loginInput),
  register: ({ registerInput }) =>
    userService.register(registerInput),
  updateProfile: ({ userInput }) =>
    userService.updateProfile(userInput),
  registerShop: ({ shopInput }) =>
    shopService.register(shopInput),
  updateShop: ({ shopInput }) =>
    shopService.update(shopInput),
  addItem: ({ itemInput }) =>
    itemService.addItem(itemInput),
  updateItem: ({ itemInput }) =>
    itemService.updateItem(itemInput),
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

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.use(cors(corsOptions));

app.use(logger('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

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
