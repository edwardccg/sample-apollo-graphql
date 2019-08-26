const { DateTimeResolver, EmailAddressResolver, JSONObjectResolver } = require('graphql-scalars');
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
  JSONObject: JSONObjectResolver,
  Content: {
    __resolveType: parent => {
      if (parent.title) {
        return 'Post';
      }
      return 'Comment';
    }
  },
  SearchResult: {
    __resolveType: parent => {
      if (parent.username) {
        return 'User';
      }
      if (parent.email) {
        return 'Comment';
      }
      if (parent.body) {
        return 'Post';
      }
      if (parent.url) {
        return 'Photo';
      }
      if (parent.completed !== undefined) {
        return 'Todo';
      }
      return 'Album';
    }
  },
  Mutation: {
    createPost: (_, args, context) => {
      const result = context.post.createPost(args.payload);
      context.pubSub.publish('postCreated', result);
      return result;
    },
    updatePost: (_, args, context) => {
      const result = context.post.updatePost(args.payload);
      context.pubSub.publish('postUpdated', result);
      return result;
    },
    deletePost: (_, args, context) => context.post.deletePost(args.postId)
  },
  Subscription: {
    postCreated: {
      resolve: parent => ({ ...parent }),
      subscribe: (_, __, context) => context.pubSub.asyncIterator('postCreated')
    },
    postUpdated: {
      resolve: parent => ({ ...parent }),
      subscribe: (_, __, context) => context.pubSub.asyncIterator('postUpdated')
    }
  },
  Query: {
    users: (_, __, context) => context.user.getAll(),
    user: (_, args, context) => context.user.findById(args.userId),
    searchContent: (_, args, context) => context.aggregate.searchContentByBody(args.body, args.limitEach),
    searchAll: (_, args, context) => context.aggregate.searchAll(args.text, args.limitEach)
  },
  User: {
    albums: (parent, _, context) => context.album.filterByUserId(parent.id),
    todolist: (parent, args, context) => {
      const todos = context.todo.filterByUserId(parent.id).sort((a, b) => b.id - a.id);

      let { cursor } = args;
      const { limit } = args;
      if (!cursor) {
        // when no cursor, default point to the first item
        cursor = todos[0].id;
      }

      const todoBeginIndex = todos.findIndex(val => val.id <= cursor);
      const todoEndIndex = todoBeginIndex + limit;
      const slicedTodos = todos.slice(todoBeginIndex, todoEndIndex);
      return {
        todos: slicedTodos,
        cursor: (todos[todoEndIndex] || {}).id
      };
    },
    posts: (parent, args, context) => {
      const { sortById, limit } = args;
      const filteredPosts = context.post.filterByUserId(parent.id);
      return limitAndSort(filteredPosts, sortById, limit);
    }
  },
  Post: {
    comments: (parent, args, context) => {
      const { sortById, limit } = args;
      const filteredComments = context.comment.filterByPostId(parent.id);
      return limitAndSort(filteredComments, sortById, limit);
    }
  },
  Album: {
    photos: (parent, _, context) => context.photo.filterByAlbumId(parent.id)
  }
};
