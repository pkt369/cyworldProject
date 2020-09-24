const Sequelize = require('sequelize');

module.exports = class PhotoFolder extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            folder: {
                type: Sequelize.STRING(100),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'PhotoFolder',
            tableName: 'photoFolders',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.PhotoFolder.belongsTo(db.User);
        db.PhotoFolder.hasMany(db.PhotoAlbum);
    }
};