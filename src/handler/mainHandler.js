const fs = require("fs");

const { ipcMain, dialog } = require("electron");
const xlsx = require("xlsx");
const { Op } = require("sequelize");
const ObjectToCsv = require("objects-to-csv");

const Karmand = require("../models/Karmand");
const Salary = require("../models/Salary");
const Status = require("../models/Status");
const mail = require("../utils/mailer");

ipcMain.handle("add", async (_, data) => {
  try {
    const { dataValues } = await Karmand.create(data);
    await Status.create({
      userId: dataValues.id,
      status: "active",
    });
    return {
      isError: false,
      msg: "created",
    };
  } catch (err) {
    return {
      isError: true,
      msg: err.errors[0].message,
    };
  }
});

ipcMain.handle("selectFile", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [
      {
        name: "Excel",
        extensions: ["xls", "xlsx", "csv"],
      },
    ],
  });
  return result;
});

ipcMain.handle("importExcel", async (_, path) => {
  try {
    //? read excel
    const excel = await xlsx.readFile(path);
    const sheetName = excel.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(excel.Sheets[sheetName]);

    for (const item of data) {
      const { dataValues } = await Karmand.create(item);
      await Status.create({
        userId: dataValues.id,
        status: "active",
      });
    }
    return {
      isError: false,
      msg: `created ${data.length} records`,
    };
  } catch (err) {
    return {
      isError: true,
      msg: err,
    };
  }
});

ipcMain.handle("getKarmands", async (_) => {
  try {
    const data = await Karmand.findAll();

    const status = await Status.findAll({
      order: [["createdAt", "DESC"]],
    });
    const cleanStatus = {};

    for (let s of status) {
      if (!Object.keys(cleanStatus).includes(s.dataValues.userId)) {
        cleanStatus[s.dataValues.userId] = s.status;
      }
    }

    return {
      isError: false,
      msg: "finded",
      data,
      status: cleanStatus,
    };
  } catch (err) {
    console.log(err);
    return {
      isError: true,
      msg: err,
    };
  }
});

ipcMain.handle("removeKarmand", async (_, id) => {
  try {
    const { response } = await dialog.showMessageBox(null, {
      buttons: ["منصرف شدم", "حذف کن"],
      title: "حذف کنم؟ ",
      message: "از عملیات خود اطمینان دارید؟ ",
    });

    if (response == 1) {
      await Karmand.destroy({
        where: {
          id,
        },
      });
      await Status.destroy({
        where: {
          userId: id,
        },
      });
      await Salary.destroy({
        where: {
          userId: id,
        },
      });

      return {
        isError: false,
        msg: "deleted",
      };
    } else {
      return {
        isError: false,
        msg: "canceled",
      };
    }
  } catch (err) {
    return {
      isError: true,
      msg: err,
    };
  }
});

ipcMain.handle("getKarmand", async (_, id) => {
  try {
    const salary = await Salary.findAll({
      where: {
        userId: id,
      },
      order: [["createdAt", "DESC"]],
    });
    const status = await Status.findAll({
      where: {
        userId: id,
      },
      order: [["createdAt", "DESC"]],
    });
    const karmand = await Karmand.findByPk(id);

    return {
      isError: false,
      msg: "finded",
      karmand,
      salary,
      status,
    };
  } catch (err) {
    console.log(err);
    return {
      isError: true,
      msg: err,
    };
  }
});

ipcMain.handle("desToKarmand", async (_, { id, des }) => {
  try {
    await Karmand.update(
      { des },
      {
        where: {
          id,
        },
      }
    );

    return {
      isError: false,
      msg: "updated",
    };
  } catch (err) {
    return {
      idError: true,
      msg: err,
    };
  }
});

ipcMain.handle("changeSalary", async (_, { userId, salary }) => {
  try {
    await Salary.create({
      userId,
      salary,
    });
    return {
      isError: false,
      msg: "created",
    };
  } catch (err) {
    return {
      isError: true,
      msg: err.errors[0].message,
    };
  }
});

ipcMain.handle("changeStatus", async (_, { userId, status }) => {
  try {
    await Status.create({
      userId,
      status,
    });
    return {
      isError: false,
      msg: "created",
    };
  } catch (err) {
    return {
      isError: true,
      msg: err.errors[0].message,
    };
  }
});

ipcMain.handle("search", async (_, search) => {
  try {
    const result = await Karmand.findAll({
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
    });

    return {
      isError: false,
      msg: "finded",
      data: result,
    };
  } catch (err) {
    return {
      isError: true,
      msg: err,
    };
  }
});

ipcMain.handle("editKarmand", async (_, { id, data }) => {
  try {
    await Karmand.update(data, {
      where: {
        id,
      },
    });

    return {
      isError: false,
      msg: "update",
    };
  } catch (err) {
    return {
      isError: true,
      msg: err.errors[0].message,
    };
  }
});

ipcMain.handle("sendMail", async (_, { id, subject, text }) => {
  try {
    const karmand = await Karmand.findByPk(id);
    const response = await mail.sendMail({
      to: karmand.dataValues.email,
      subject,
      text,
    });
    console.log(response);

    return {
      isError: false,
      msg: "sended",
    };
  } catch (err) {
    return {
      isError: true,
      msg: err,
    };
  }
});

ipcMain.handle("exportCsv", async (_) => {
  try {
    const { filePath, canceled } = await dialog.showSaveDialog();

    if (canceled) {
      return {
        isError: false,
        msg: "canceled",
      };
    }

    const karmand = await Karmand.findAll({
      raw: true,
      attributes: [
        "name",
        "jobName",
        "age",
        "dateOfBirth",
        "dateJoin",
        "email",
        "phoneNumber",
        "skills",
      ],
    });

    const csv = new ObjectToCsv(karmand);
    await fs.writeFileSync(`${filePath}.csv`, `\uFEFF ${await csv.toString()}`);

    return {
      isError: false,
      msg: `backup ${karmand.length}`,
      record: karmand.length,
    };
  } catch (err) {
    return {
      isError: true,
      msg: err,
    };
  }
});

ipcMain.handle("amar", async (_) => {
  try {
    //? status
    let active = 0;
    let fire = 0;
    let leave = 0;

    const userIdStatus = [];
    const status = await Status.findAll({
      order: [["createdAt", "DESC"]],
    });

    for (let s of status) {
      if (!userIdStatus.includes(s.userId)) {
        switch (s.status) {
          case "active":
            active++;
            break;
          case "fire":
            fire++;
            break;
          case "leave":
            leave++;
            break;
          default:
            break;
        }

        userIdStatus.push(s.userId);
      }
    }

    const userIdSalary = [];
    let totalSalary = 0;

    const salary = await Salary.findAll();

    for (let s of salary) {
      if (!userIdSalary.includes(s.userId)) {
        totalSalary += +s.salary;

        userIdSalary.push(s.userId);
      }
    }

    return {
      isError: false,
      msg: "finded",
      status: {
        active,
        fire,
        leave,
      },
      totalSalary,
      sum: await Karmand.count(),
    };
  } catch (err) {
    return {
      isError: true,
      msg: err,
    };
  }
});
