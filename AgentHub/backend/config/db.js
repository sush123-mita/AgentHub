const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('agenthub', 'agenthub_user', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
