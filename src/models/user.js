const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  failed_login_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'not_activated',
  },
  referral_code: {
    type: DataTypes.STRING,
    unique: true,
  },
  has_discount: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  locked_until: {
    type: DataTypes.DATE,
  },
  trial_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  admin: {
    type: DataTypes.BOOLEAN
  }
},
  {
    timestamps: false,
  });

module.exports = User;