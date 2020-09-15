const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Guestbook = require('./guestbook');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Guestbook = Guestbook;

//각각의 모델을 시퀄라이즈에 연결
User.init(sequelize);
Guestbook.init(sequelize);

User.associate(db);
Guestbook.associate(db);

module.exports = db;
