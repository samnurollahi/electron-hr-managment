const { DataTypes } = require("sequelize");

const db = require("../config/db");

module.exports = db.define(
  "status",
  {
    userId: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "کاربری برای این حقوق تنظیم نشده است" },
      },
    },
    status: {
      type: DataTypes.ENUM("fire", "active", "leave"),
      validate: {
        notEmpty: { msg: "وضعیت به درستی وارد نشده است" },
      },
    },
  },
  { tableName: "status", updatedAt: false, createdAt: true }
);
