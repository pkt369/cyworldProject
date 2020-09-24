const Sequelize = require('sequelize');

module.exports = class PhotoAlbum extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            image: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'PhotoAlbum',
            tableName: 'photoAlbums',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.PhotoAlbum.belongsTo(db.PhotoFolder);
        db.PhotoAlbum.belongsTo(db.User);
    }
};