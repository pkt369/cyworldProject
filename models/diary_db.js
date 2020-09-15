const Sequelize = require('sequelize');

module.exports = class diaryDB extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(2000),
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Diary_db',
            tableName: 'diary_dbs',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {

    }
};