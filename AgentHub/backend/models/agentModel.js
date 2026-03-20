const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Agent = sequelize.define('Agent', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: '🤖'
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#6366f1'
  },
  promptTemplate: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  inputFields: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  avgRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  totalRatings: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  trending: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'agents',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Agent;
