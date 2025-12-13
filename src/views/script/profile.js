const content = document.getElementById("content"),
  header = document.getElementById("header");

const id = location.search.split("?")[1].split("=")[1];

window.addEventListener("DOMContentLoaded", async () => {
  const response = await window.myApi.getKarmand(id);

  if (response.isError) {
    console.error(response.msg);
  } else {
    if (!response.karmand) {
      return (content.innerHTML =
        "<h1 class='text-center'>کارمندی یافت نشد</h1>");
    }
    const data = response.karmand.dataValues;
    const salary = response.salary;
    const status = response.status;

    header.innerHTML = `

        <p class="ml-2">اقا/خانم ${data.name}</p>

        <span class="${
          response.status[0].dataValues.status == "active"
            ? "bg-green-500"
            : response.status[0].dataValues.status == "fire"
            ? "bg-red-500"
            : "bg-yellow-500"
        }  text-white p-1 rounded-md select-none"
      >${
        response.status[0].dataValues.status == "active"
          ? "فعال"
          : response.status[0].dataValues.status == "fire"
          ? "اخراج شده"
          : "مرخصی"
      }</span
    >


    `;
    console.log(salary);
    let historyOfSalaryTabel = ``;
    salary.forEach((item) => {
      historyOfSalaryTabel += `

                <tr>
                  <td class="pl-5">${moment(item.dataValues.createdAt)
                    .locale("fa")
                    .format("YYYY/MM/DD")}</td>
                  <td>${item.dataValues.salary}</td>
                </tr>
      `;
    });

    let historyOfStatus = ``;
    status.forEach((item) => {
      historyOfStatus += `

                <tr>
                  <td class="pl-5">${moment(item.dataValues.createdAt)
                    .locale("fa")
                    .format("YYYY/MM/DD")}</td>
                  <td>${
                    item.dataValues.status == "active"
                      ? "فعال"
                      : item.dataValues.status == "fire"
                      ? "اخراج شده"
                      : "مرخصی"
                  }</td>
                </tr>
      `;
    });

    const now = new Date();
    content.innerHTML = `
            <div>
          <table>
            <tbody>
              <tr>
                <td class="pl-10 pb-5">نام</td>
                <td class="pb-5">${data.name}</td>
              </tr>
              <tr>
                <td class="pl-10 pb-5">ایمیل</td>
                <td  class="pb-5">${data.email}</td>
              </tr>
              <tr>
                <td class="pl-10 pb-5">سن</td>
                <td class="pb-5">${data.age}</td>
              </tr>
              <tr>
                <td class="pl-10 pb-5 ${
                  now.getFullYear() == data.dateOfBirth.getFullYear() &&
                  now.getMonth() == data.dateOfBirth.getMonth() &&
                  now.getDay() == data.dateOfBirth.getDay()
                    ? "text-red-700 font-bold"
                    : ""
                }">تاریخ تولد</td>
                <td class="pb-5 ${
                  now.getFullYear() == data.dateOfBirth.getFullYear() &&
                  now.getMonth() == data.dateOfBirth.getMonth() &&
                  now.getDay() == data.dateOfBirth.getDay()
                    ? "text-red-700 font-bold"
                    : ""
                }">${moment(data.dateOfBirth)
      .locale("fa")
      .format("YYYY/MM/DD")}</td>
              </tr>
              <tr>
                <td class="pl-10 pb-5">تاریخ ورود</td>
                <td class="pb-5">${data.dateJoin}</td>
              </tr>
              <tr>
                <td class="pl-10 pb-5">شماره موبایل</td>
                <td class="pb-5">${data.phoneNumber}</td>
              </tr>
                            <tr>
                <td class="pl-10 pb-5">مهارت ها</td>
                <td class="pb-5">${data.skills}</td>
              </tr>
                            <tr>
                <td class="pl-10 pb-5">عنوان شغلی</td>
                <td class="pb-5">${data.jobName}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br>
        <hr>
        <br>
        <div class="flex flex-col">
                <div
          id="alertBoxDes"
          class="text-white bg-red-500 rounded-lg m-auto w-full py-4 px-3 mb-[25px] hidden"
        ></div>

          <label for="des">یادداشت برای این کارمند</label>
          <textarea
            name=""
            id="des"
            placeholder="چیزی بنویسید ...."
            class="border rounded-md border-stone-200 mt-2 p-2 resize-none h-[150px] outline-0 bg-stone-100 transition-all focus:bg-white"
          >${data.des}</textarea>
          <div>
            <button
              onclick="desToKarmand('${data.id}', this)"
              class="bg-green-500 px-4 py-2 text-white block m-auto mt-5 cursor-pointer rounded-md transition-all hover:bg-green-400"
            >
              پیوست یادداشت به این کارمند
            </button>
          </div>
        </div>



                <br />
        <hr />
        <br />
        <div>
                <div class="flex flex-col">
                <div
          id="alertBoxSalary"
          class="text-white bg-red-500 rounded-lg m-auto w-full py-4 px-3 mb-[25px] hidden"
        ></div>
          <div class="flex items-center">
            <p id="countSalary">میزان حقوق: ${
              response.salary.length > 0
                ? response.salary[0].dataValues.salary
                : "تعریف نشده"
            }</p>
            <i
              onclick="toggleHistoryOfSalary()"
              class="fa fa-arrow-down text-[13px] pr-4 cursor-pointer text-blue-700"
            ></i>
          </div>
          <div class="mt-[15px] hidden" id="historyOfSalary">
            <p class="mb-2">تاریخچه حقوق</p>

            <table>
              <tbody>
                  ${historyOfSalaryTabel}
              </tbody>
            </table>
          </div>

          <div class="">
            <label for="salary" class="select-none">تغییر حقوق</label>
            <input
            min="1"
              type="number"
              id="salary"
              class="border border-stone-200 bg-stone-100 transition-all focus:bg-white outline-0 px-2 py-3 rounded-md"
            />
            <button
              onclick="changeSalary('${data.id}')"
              class="bg-green-500 px-4 py-3 text-white mt-5 cursor-pointer rounded-md transition-all hover:bg-green-400"
            >
              تغییر
            </button>
          </div>
        </div>




        
        <br />
        <hr />
        <br />
        <div>
          <div class="flex flex-col">
            <div
              id="alertBoxStatus"
              class="text-white bg-red-500 rounded-lg m-auto w-full py-4 px-3 mb-[25px] hidden"
            ></div>
            <div class="flex items-center">
              <p id="status">وضعیت: ${
                response.status[0].dataValues.status == "active"
                  ? "فعال"
                  : response.status[0].dataValues.status == "fire"
                  ? "اخراج شده"
                  : "مرخصی"
              }</p>
              <i
                onclick="toggleHistoryOfStatus()"
                class="fa fa-arrow-down text-[13px] pr-4 cursor-pointer text-blue-700"
              ></i>
            </div>
            <div class="mt-[15px] hidden" id="historyOfStatus">
              <p class="mb-2">تاریخچه وضعیت</p>

              <table>
                <tbody>
                ${historyOfStatus}
                </tbody>
              </table>
            </div>

            <div class="">
              <label for="changeStatus" class="select-none">تغییر وضعیت</label>
              <select
                id="changeStatus"
                class="border border-stone-200 bg-stone-100 transition-all focus:bg-white outline-0 px-2 py-3 rounded-md"
              >
                <option value="active">فعال</option>
                <option value="leave">مرخصی</option>
                <option value="fire">اخراج</option>
              </select>
              <button
                onclick="changeStatus('${data.id}')"
                class="bg-green-500 px-4 py-3 text-white mt-5 cursor-pointer rounded-md transition-all hover:bg-green-400"
              >
                تغییر
              </button>
            </div>
          </div>
        </div>





                <br>
        <hr>
        <br>
        <div class="flex flex-col">
        <div
          id="alertBoxEmail"
          class="text-white bg-red-500 rounded-lg m-auto w-full py-4 px-3 mb-[25px] hidden"
        ></div>

          <label for="sendMailContent" title="${"این ایمیل از طرف ایمیل دیفالت برنامه میرود!"}">  ارسال ایمیل برای این کارمند </label>
          <input id="subjectEmail" placeholder="موضوع ایمیل" class="border rounded-md border-stone-200 mt-2 p-2 resize-none  outline-0 bg-stone-100 transition-all focus:bg-white" />
          <textarea
            name=""
            id="textEmail"
            placeholder=" متن ایمیل ...."
            class="border rounded-md border-stone-200 mt-2 p-2 resize-none h-[150px] outline-0 bg-stone-100 transition-all focus:bg-white"
          ></textarea>
          <div>
            <button
              onclick="sendEmail('${data.id}', this)"
              class="bg-green-500 px-4 py-2 text-white block m-auto mt-5 cursor-pointer rounded-md transition-all hover:bg-green-400"
            >
              ارسال
            </button>
          </div>
        </div>
    `;
  }
});

async function desToKarmand(id, btn) {
  const des = document.getElementById("des").value,
    alertBoxDes = document.getElementById("alertBoxDes");

  const response = await window.myApi.desToKarmand({ id, des });
  if (response.isError) {
    alertBoxDes.innerHTML = "اضافه کردن یادداشت به کارمند با خطا مواجه شد";
    alertBoxDes.classList.remove("hidden");
    alertBoxDes.classList.remove("bg-green-500");
    alertBoxDes.classList.add("bg-red-500");

    setInterval(() => {
      alertBoxDes.classList.add("hidden");
    }, 5_000);
  } else {
    alertBoxDes.innerHTML = "یادداشت با موفقیت به کاربر اضافه شد";
    alertBoxDes.classList.remove("hidden");
    alertBoxDes.classList.remove("bg-red-500");
    alertBoxDes.classList.add("bg-green-500");

    setInterval(() => {
      alertBoxDes.classList.add("hidden");
    }, 5_000);
  }
}

async function changeSalary(id) {
  const salary = document.getElementById("salary").value,
    alertBoxSalary = document.getElementById("alertBoxSalary"),
    countSalary = document.getElementById("countSalary");

  const response = await window.myApi.changeSalary({ userId: id, salary });
  if (response.isError) {
    alertBoxSalary.innerHTML = response.msg;
    alertBoxSalary.classList.remove("hidden");
    alertBoxSalary.classList.remove("bg-green-500");
    alertBoxSalary.classList.add("bg-red-500");

    setInterval(() => {
      alertBoxSalary.classList.add("hidden");
    }, 5_000);
  } else {
    alertBoxSalary.innerHTML = "حقوق تغییر کرد";
    alertBoxSalary.classList.remove("hidden");
    alertBoxSalary.classList.remove("bg-red-500");
    alertBoxSalary.classList.add("bg-green-500");

    countSalary.innerHTML = `میزان حقوق: ${salary}`;

    setInterval(() => {
      alertBoxSalary.classList.add("hidden");
    }, 5_000);
  }
}

async function changeStatus(id) {
  const changeStatusSelect = document.getElementById("changeStatus").value,
    alertBoxStatus = document.getElementById("alertBoxStatus"),
    status = document.getElementById("status");

  const response = await window.myApi.changeStatus({
    userId: id,
    status: changeStatusSelect,
  });
  if (response.isError) {
    alertBoxStatus.innerHTML = response.msg;
    alertBoxStatus.classList.remove("hidden");
    alertBoxStatus.classList.remove("bg-green-500");
    alertBoxStatus.classList.add("bg-red-500");

    setInterval(() => {
      alertBoxStatus.classList.add("hidden");
    }, 5_000);
  } else {
    alertBoxStatus.innerHTML = "وضعیت با موفقیت تغییر کرد";
    alertBoxStatus.classList.remove("hidden");
    alertBoxStatus.classList.remove("bg-red-500");
    alertBoxStatus.classList.add("bg-green-500");

    status.innerHTML = `وضعیت : ${
      changeStatusSelect == "active"
        ? "فعال"
        : changeStatusSelect == "fire"
        ? "اخراج شده"
        : "مرخصی"
    }`;

    setInterval(() => {
      alertBoxStatus.classList.add("hidden");
    }, 5_000);
  }
}

function toggleHistoryOfSalary() {
  document.getElementById("historyOfSalary").classList.toggle("hidden");
}

function toggleHistoryOfStatus() {
  document.getElementById("historyOfStatus").classList.toggle("hidden");
}

async function sendEmail(id, btn) {
  btn.disabled = true;
  btn.innerHTML = "<span class='loader'></span>";

  const alertBoxEmail = document.getElementById("alertBoxEmail");

  const response = await window.myApi.sendMail({
    id,
    subject: subjectEmail.value,
    text: textEmail.value,
  });

  if (response.isError) {
    alertBoxEmail.innerHTML = response.msg;
    alertBoxEmail.classList.remove("hidden");
    alertBoxEmail.classList.remove("bg-green-500");
    alertBoxEmail.classList.add("bg-red-500");

    setInterval(() => {
      alertBoxEmail.classList.add("hidden");
    }, 5_000);
  } else {
    alertBoxEmail.innerHTML = "ایمیل ارسال شد";
    alertBoxEmail.classList.remove("hidden");
    alertBoxEmail.classList.remove("bg-red-500");
    alertBoxEmail.classList.add("bg-green-500");

    setInterval(() => {
      alertBoxEmail.classList.add("hidden");
    }, 5_000);
  }

  btn.innerHTML = "ارسال";
}
