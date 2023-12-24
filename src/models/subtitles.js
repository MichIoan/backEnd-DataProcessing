const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Subtitle = sequelize.define('Subtitle', {
    subtitle_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    media_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    language: {
        type: DataTypes.STRING,
    },
    subtitle_path: {
        type: DataTypes.STRING,
    }
},
    {
        timestamps: false,
    });

module.exports = Subtitle;