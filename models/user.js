// 사용자 정보 저장

const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING(2),
        allowNull: true,
      }
      
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true, // 자동으로 createAt, updateAt, deleteAt 컬럼 생성됨
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }


};
