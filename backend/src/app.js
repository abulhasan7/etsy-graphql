/* eslint-disable no-unused-vars */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
require('dotenv').config();
const cors = require('cors');
// eslint-disable-next-line semi
const { graphqlHTTP } = require('express-graphql');
const passport = require('passport');
const config = require('./graphql/config');
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

app.use((req, res, next) => {
  passport.authenticate(
    'jwt',
    { session: false, failWithError: true },
    (error, user, info) => {
      console.log('error', error);
      console.log('user', user);
      console.log('info', info);
      req.user = user;
      next(null, user);
    // eslint-disable-next-line no-undef
    },
  )(req, res, next);
});

app.use(logger('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use('/graphql', graphqlHTTP(config));

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
