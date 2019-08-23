const path = require('path');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const dbPath = path.join(__dirname, './db.json');
const db = low(new FileSync(dbPath));

const user = {
  getAll: () => db.get('users').value(),
  findById: id =>
    db
      .get('users')
      .find({ id })
      .value(),
  filterByNameContains: (text, limitEach) =>
    db
      .get('users')
      .filter(val => val.name.includes(text))
      .take(limitEach)
      .value()
};

const album = {
  filterByUserId: userId =>
    db
      .get('albums')
      .filter({ userId })
      .value(),
  filterByTitleContains: (text, limitEach) =>
    db
      .get('albums')
      .filter(val => val.title.includes(text))
      .take(limitEach)
      .value()
};

const todo = {
  filterByUserId: userId =>
    db
      .get('todos')
      .filter({ userId })
      .value(),
  filterByTitleContains: (text, limitEach) =>
    db
      .get('todos')
      .filter(val => val.title.includes(text))
      .take(limitEach)
      .value()
};

const post = {
  filterByUserId: userId =>
    db
      .get('posts')
      .filter({ userId })
      .value(),
  filterByBodyContains: (body, limitEach) =>
    db
      .get('posts')
      .filter(val => val.body.includes(body))
      .take(limitEach)
      .value(),
  filterByTitleContains: (text, limitEach) =>
    db
      .get('posts')
      .filter(val => val.title.includes(text))
      .take(limitEach)
      .value()
};

const comment = {
  filterByPostId: postId =>
    db
      .get('comments')
      .filter({ postId })
      .value(),
  filterByBodyContains: (body, limitEach) =>
    db
      .get('comments')
      .filter(val => val.body.includes(body))
      .take(limitEach)
      .value(),
  filterByNameContains: (text, limitEach) =>
    db
      .get('comments')
      .filter(val => val.name.includes(text))
      .take(limitEach)
      .value()
};

const photo = {
  filterByAlbumId: albumId =>
    db
      .get('photos')
      .filter({ albumId })
      .value(),
  filterByTitleContains: (text, limitEach) =>
    db
      .get('photos')
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
