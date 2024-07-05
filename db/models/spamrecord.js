"use strict";
const { Model } = require("sequelize");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
module.exports = sequelize.define(
  "spamRecord",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    phoneNumber: {
      allowNull: false,
      type: DataTypes.BIGINT,
    },
    name: {
      type: DataTypes.STRING,
    },
    registeredUserId: {
      type: DataTypes.UUID,
    },
    reportedByUserId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "spamRecord",
  }
);
