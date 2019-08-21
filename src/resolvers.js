const { DateTimeResolver, EmailAddressResolver } = require('graphql-scalars');
/**
 *
 * @param {any[]} array
 * @param {'DESC' | 'ASC'} sortById
 * @param {Number} limit
 */
const limitAndSort = (array, sortById, limit) => {
  if (sortById === 'DESC') {
    array.sort((a, b) => b.id - a.id);
  } else {
    array.sort((a, b) => a.id - b.id);
  }
  if (limit > 0) {
    return array.slice(0, limit);
  }
  return array;
};

/** @type {import('apollo-server').IResolvers} */
module.exports = {
  DateTime: DateTimeResolver,
  EmailAddress: EmailAddressResolver,
  Query: {
    users: (_, __, context) => context.user.findAll(),
    user: (_, args, context) => context.user.findById(args.userId)
  },
  User: {
    albums: (parent, _, context) => context.album.findByUserId(parent.id),
    todos: (parent, _, context) => context.todo.findByUserId(parent.id),
    posts: (parent, args, context) => {
      const { sortById, limit } = args;
      const filteredPosts = context.post.findByUserId(parent.id);
      return limitAndSort(filteredPosts, sortById, limit);
    }
  },
  Post: {
    comments: (parent, args, context) => {
      const { sortById, limit } = args;
      const filteredComments = context.comment.findByPostId(parent.id);
      return limitAndSort(filteredComments, sortById, limit);
    }
  },
  Album: {
    photos: (parent, _, context) => context.photo.findByAlbumId(parent.id)
  }
};
