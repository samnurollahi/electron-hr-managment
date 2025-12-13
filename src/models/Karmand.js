const { DataTypes } = require("sequelize");
const db = require("../config/db");

module.exports = db.define(
  "karmand",
  {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "نام کارمند نباید خالی باشد" },
        max: { args: 255, msg: "نام کارمند خیلی طولانی است" },
      },
    },
    jobName: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.NUMBER,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
    dateJoin: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: { msg: "ساختار ایمیل کارمند نادرست است" },
        max: { args: 255, msg: "ایمیل کارمند خیلی طولانی است" },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    skills: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    historyOfSalary: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    historyOfVacation: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    des: {
      type: DataTypes.STRING,
      validate: {
        max: { args: 500, msg: "توضیحات کارمند بسیار طولانی است" },
      },
      defaultValue: "",
    },
    status: {
      type: DataTypes.ENUM("fire", "active", "leave"),
      defaultValue: "active",
    },
  },
  { tableName: "karmand", timestamps: true }
);
