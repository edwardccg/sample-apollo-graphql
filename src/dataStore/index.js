const fs = require('fs');
const path = require('path');

/**
 * read json data file and parse into JavaScript Array Object
 * @param {String} relativePath
 * @returns {any[]}
 */
const readJSONintoObject = relativePath => {
  const strJSON = fs.readFileSync(path.join(__dirname, relativePath), 'utf8');
  return JSON.parse(strJSON);
};

const albums = readJSONintoObject('./albums.json');
const comments = readJSONintoObject('./comments.json');
const photos = readJSONintoObject('./photos.json');
const posts = readJSONintoObject('./posts.json');
const todos = readJSONintoObject('./todos.json');
const users = readJSONintoObject('./users.json');

module.exports = {
  albums,
  comments,
  photos,
  posts,
  todos,
  users
};
