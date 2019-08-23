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
      .value()
};

const album = {
  filterByUserId: userId =>
    db
      .get('albums')
      .filter({ userId })
      .value()
};

const todo = {
  filterByUserId: userId =>
    db
      .get('todos')
      .filter({ userId })
      .value()
};

const post = {
  filterByUserId: userId =>
    db
      .get('posts')
      .filter({ userId })
      .value()
};

const comment = {
  filterByPostId: postId =>
    db
      .get('comments')
      .filter({ postId })
      .value()
};

const photo = {
  filterByAlbumId: albumId =>
    db
      .get('photos')
      .filter({ albumId })
      .value()
};

const content = {
  searchContentByBody: body => {
    const posts = db
      .get('posts')
      .filter(val => val.body.includes(body))
      .value();
    const comments = db
      .get('comments')
      .filter(val => val.body.includes(body))
      .value();
    return [...posts, ...comments];
  }
};

module.exports = { user, album, todo, post, comment, photo, content };
