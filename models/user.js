// 사용자 정보 저장

const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING(4),
        allowNull: false,
      },
      
      
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
