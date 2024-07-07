"use strict";
const { Model } = require("sequelize");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const globalStore = sequelize.define(
  "globalStore",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    phoneNumber: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    registeredUserId: {
      type: DataTypes.UUID,
      unique: true,
    },
    importedByUserId: {
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
      type: Sequelize.DATE,
    },
  },
  {
    paranoid: true,
    freezeTableName: true,
    modelName: "globalStore",
  }
);

module.exports = globalStore;
