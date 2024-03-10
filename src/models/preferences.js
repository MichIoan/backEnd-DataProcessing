const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Preferences = sequelize.define('Preferences', {
    preference_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    profile_id: {
        type: DataTypes.INTEGER
    },
    content_type: {
        type: DataTypes.STRING,
    },
    genre: {
        type: DataTypes.STRING,
    },
    minimum_age: {
        type: DataTypes.STRING,
    },
    viewing_classification: {
        type: DataTypes.STRING,
    },
},
    {
        timestamps: false,
        tableName: 'Preferences',
    });

module.exports = Preferences;