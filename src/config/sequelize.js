const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  database: 'postgres',
  username: 'user',
  password: 'root',
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
