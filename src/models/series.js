const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Series = sequelize.define('Series', {
    series_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age_restriction: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    viewing_classification: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    genre: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
},
    {
        timestamps: false,
    });

module.exports = Series;