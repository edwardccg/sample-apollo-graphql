/* eslint-disable no-shadow */
// @ts-nocheck
const path = require('path');
const lodashId = require('lodash-id');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const dbPath = path.join(__dirname, './db.json');
const db = low(new FileSync(dbPath));
db._.mixin(lodashId);

const userCollection = db.get('users');
const albumCollection = db.get('albums');
const todoCollection = db.get('todos');
const postCollection = db.get('posts');
const commentCollection = db.get('comments');
const photoCollection = db.get('photos');

const user = {
  getAll: () => userCollection.value(),
  findById: id => userCollection.find({ id }).value(),
  filterByNameContains: (text, limitEach) =>
    userCollection
      .filter(val => val.name.includes(text))
      .take(limitEach)
      .value()
};

const album = {
  filterByUserId: userId => albumCollection.filter({ userId }).value(),
  filterByTitleContains: (text, limitEach) =>
    albumCollection
      .filter(val => val.title.includes(text))
      .take(limitEach)
      .value()
};

const todo = {
  filterByUserId: userId => todoCollection.filter({ userId }).value(),
  filterByTitleContains: (text, limitEach) =>
    todoCollection
      .filter(val => val.title.includes(text))
      .take(limitEach)
      .value()
};

const post = {
  filterByUserId: userId => postCollection.filter({ userId }).value(),
  filterByBodyContains: (body, limitEach) =>
    postCollection
      .filter(val => val.body.includes(body))
      .take(limitEach)
      .value(),
  filterByTitleContains: (text, limitEach) =>
    postCollection
      .filter(val => val.title.includes(text))
      .take(limitEach)
      .value(),
  createPost: post => {
    const lastPost = postCollection.maxBy(val => val.id).value();
    const id = lastPost.id + 1;
    return postCollection.insert({ id, ...post }).write();
  },
  updatePost: post =>
    postCollection
      .find({ id: post.id })
      .assign(post)
      .write(),
  deletePost: postId => {
    commentCollection.remove({ postId }).write(); // delete comments that associate to Post first
    postCollection.remove({ id: postId }).write();
    return 'SUCCESS';
  }
};

const comment = {
  filterByPostId: postId => commentCollection.filter({ postId }).value(),
  filterByBodyContains: (body, limitEach) =>
    commentCollection
      .filter(val => val.body.includes(body))
      .take(limitEach)
      .value(),
  filterByNameContains: (text, limitEach) =>
    commentCollection
      .filter(val => val.name.includes(text))
      .take(limitEach)
      .value()
};

const photo = {
  filterByAlbumId: albumId => photoCollection.filter({ albumId }).value(),
  filterByTitleContains: (text, limitEach) =>
    photoCollection
      .filter(val => val.title.includes(text))
      .take(limitEach)
      .value()
};

const aggregate = {
  searchContentByBody: (body, limitEach) => {
    const posts = post.filterByBodyContains(body, limitEach);
    const comments = comment.filterByBodyContains(body, limitEach);
    return [...posts, ...comments];
  },
  searchAll: (text, limitEach) => {
    const users = user.filterByNameContains(text, limitEach);
    const posts = post.filterByTitleContains(text, limitEach);
    const comments = comment.filterByNameContains(text, limitEach);
    const todos = todo.filterByTitleContains(text, limitEach);
    const albums = album.filterByTitleContains(text, limitEach);
    const photos = photo.filterByTitleContains(text, limitEach);
    return [...users, ...posts, ...comments, ...todos, ...albums, ...photos];
  }
};

module.exports = { user, album, todo, post, comment, photo, aggregate };
