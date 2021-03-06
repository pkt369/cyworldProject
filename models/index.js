const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Guestbook = require('./guestbook');

const PhotoFolder = require('./photoFolder');
const PhotoAlbum = require('./photoAlbum');
const Post = require('./post');


const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Guestbook = Guestbook;
db.PhotoFolder = PhotoFolder;
db.PhotoAlbum = PhotoAlbum;
db.Post = Post;


//각각의 모델을 시퀄라이즈에 연결
User.init(sequelize);
Guestbook.init(sequelize);
PhotoFolder.init(sequelize);
PhotoAlbum.init(sequelize);
Post.init(sequelize);

User.associate(db);
Guestbook.associate(db);
PhotoFolder.associate(db);
PhotoAlbum.associate(db);
Post.associate(db);




module.exports = db;
