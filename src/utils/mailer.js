const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

module.exports = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    port: 465,
    secure: true,

    auth: {
      user: "samn00024@gmail.com",
      pass: "knvojeczlbiztfrt",
    },

    tls: {
      rejectUnauthorized: false,
    },
  })
);
