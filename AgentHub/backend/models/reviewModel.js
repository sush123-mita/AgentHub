const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Agent = require('./agentModel');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  agent_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Agent,
      key: 'id'
    }
  },
  user: {
    type: DataTypes.STRING,
    defaultValue: 'Anonymous'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: {
    type: DataTypes.TEXT,
    defaultValue: ''
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

Agent.hasMany(Review, { foreignKey: 'agent_id', as: 'reviews' });
Review.belongsTo(Agent, { foreignKey: 'agent_id' });

module.exports = Review;
