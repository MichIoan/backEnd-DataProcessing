const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WatchHistory = sequelize.define('WatchHistory', {
    history_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    profile_id: {
        type: DataTypes.INTEGER
    },
    media_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    resume_to: {
        type: DataTypes.STRING
    },
    times_watched: {
        type: DataTypes.INTEGER,
    },
    time_stamp: {
        type: DataTypes.DATE,
    },
    viewing_status: {
        type: DataTypes.STRING
    }
},
    {
        timestamps: false,
    });

module.exports = WatchHistory;