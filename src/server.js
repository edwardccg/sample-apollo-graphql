/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// @ts-nocheck
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { user, album, todo, post, comment, photo, aggregate } = require('./dataStore');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context: { user, album, todo, post, comment, photo, aggregate },
  context: ({ connection, req, res }) => {
    return { user, album, todo, post, comment, photo, aggregate };
  }
});

server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
