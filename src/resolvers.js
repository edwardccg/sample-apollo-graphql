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
  Query: {
    users: (_, __, context) => context.users,
    user: (_, args, context) => context.users.find(user => user.id === args.userId)
  },
  User: {
    albums: (parent, _, context) => context.albums.filter(album => album.userId === parent.id),
    todos: (parent, _, context) => context.todos.filter(todo => todo.userId === parent.id),
    posts: (parent, args, context) => {
      const { sortById, limit } = args;
      const filteredPosts = context.posts.filter(post => post.userId === parent.id);
      return limitAndSort(filteredPosts, sortById, limit);
    }
  },
  Post: {
    comments: (parent, args, context) => {
      const { sortById, limit } = args;
      const filteredComments = context.comments.filter(comment => comment.postId === parent.id);
      return limitAndSort(filteredComments, sortById, limit);
    }
  },
  Album: {
    photos: (parent, _, context) => context.photos.filter(photo => photo.albumId === parent.id)
  }
};
