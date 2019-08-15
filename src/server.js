/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// @ts-nocheck
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { users, posts, albums, todos, comments, photos } = require('./dataStore');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context: { users, posts, albums, todos, comments, photos },
  context: ({ connection, req, res }) => {
    return { users, posts, albums, todos, comments, photos };
  }
});

server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
