const path = require('path');
const { gql } = require('apollo-server');
const { importSchema } = require('graphql-import');

const schema = importSchema(path.resolve(__dirname, './schema.graphql'));

module.exports = [gql(schema)];
