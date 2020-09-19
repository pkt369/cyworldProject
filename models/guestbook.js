const Sequelize = require('sequelize');

module.exports = class Guestbook extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(2000),
                allowNull: false,
            },
            host_email: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            writer_email: {
                type: Sequelize.STRING(100),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Guestbook',
            tableName: 'guestbooks',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Guestbook.belongsTo(db.User);
    }
};