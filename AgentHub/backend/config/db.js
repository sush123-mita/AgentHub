
/*const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('agenthub', 'agenthub_user', 'password', {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false,
});
*/

const sequelize = new Sequelize(
  process.env.DB_NAME || 'agenthub',
  process.env.DB_USER || 'agenthub_user',
  process.env.DB_PASSWORD || 'password',
{
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false,
});
/*
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true  // ⚠️ Required for TiDB Cloud
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);*/

module.exports = sequelize;
