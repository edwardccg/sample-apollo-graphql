const { gql } = require('apollo-server');

const typeDefs = gql`
  # Query is the reserved type for query operation
  type Query {
    users: [User]
    user(userId: Int!): User
  }

  """
  This is the user type
  """
  type User {
    id: Int
    name: String
    username: String
    email: String
    address: Address
    phone: String
    """
    The personalize website URL for the user
    """
    website: String
    company: Company
    posts(limit: Int, sortById: SortType): [Post] #relation to posts
    albums: [Album] #relation to albums
    todos: [Todo] #relation to todos
  }
  type Address {
    street: String
    suite: String
    city: String
    zipcode: String
    geo: GeoLocation
  }
  type GeoLocation {
    lat: String
    lng: String
  }
  type Company {
    name: String
    catchPhrase: String
    bs: String
  }

  """
  Post by the user
  """
  type Post {
    id: Int
    title: String
    body: String
    comments(limit: Int, sortById: SortType): [Comment] #relation to comments
  }

  """
  Comment to the post by other people
  """
  type Comment {
    id: Int
    name: String
    email: String
    body: String
  }

  """
  User Album
  """
  type Album {
    id: Int
    title: String
    photos: [Photo]
  }

  """
  Photo that store inside the Album
  """
  type Photo {
    id: Int
    title: String
    url: String
    thumbnailUrl: String
  }

  """
  Todo item by the user
  """
  type Todo {
    id: Int
    title: String
    completed: Boolean
  }

  enum SortType {
    DESC
    ASC
  }
`;

module.exports = typeDefs;
