const { DataTypes } = require("sequelize");
const db = require("../config/db");

module.exports = db.define(
  "salary",
  {
    userId: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "کاربری برای این حقوق تنظیم نشده است" },
      },
    },
    salary: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "مقدار حقوق الزامی است" },
      },
    },
  },
  { updatedAt: false, createdAt: true, tableName: "salary" }
);
