const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
// const userService = require('../services/userService');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    addTwoNums(num1:Int,num2:Int):Int
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  addTwoNums: ({ num1, num2 }) =>
    num1 + num2,

};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
