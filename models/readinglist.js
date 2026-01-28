const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class ReadingList extends Model {}

ReadingList.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  read: {
    type:DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  userId : {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  blogId : {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'readinglist'
})

module.exports = ReadingList;