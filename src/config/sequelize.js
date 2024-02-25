const { Sequelize } = require('sequelize');

const env = process.env;

const sequelize = new Sequelize({
  database: env.db_name,
  username: env.db_username,
  password: env.db_password,
  host: env.db_host,
  dialect: env.db_dialect,
});

module.exports = sequelize;
