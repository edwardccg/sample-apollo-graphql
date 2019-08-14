const { users, posts, albums, todos, comments, photos } = require('./dataStore');

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
    users: () => users,
    user: (_, args) => users.find(user => user.id === args.userId)
  },
  User: {
    albums: parent => albums.filter(album => album.userId === parent.id),
    todos: parent => todos.filter(todo => todo.userId === parent.id),
    posts: (parent, args) => {
      const { sortById, limit } = args;
      const filteredPosts = posts.filter(post => post.userId === parent.id);
      return limitAndSort(filteredPosts, sortById, limit);
    }
  },
  Post: {
    comments: (parent, args) => {
      const { sortById, limit } = args;
      const filteredComments = comments.filter(comment => comment.postId === parent.id);
      return limitAndSort(filteredComments, sortById, limit);
    }
  },
  Album: {
    photos: parent => photos.filter(photo => photo.albumId === parent.id)
  }
};
