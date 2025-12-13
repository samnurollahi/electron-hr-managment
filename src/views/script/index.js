const btnAddKarmand = document.getElementById("btnAddKarmand"),
  content = document.getElementById("content"),
  search = document.getElementById("search"),
  exportCsv = document.getElementById("exportCsv"),
  alertExportCsv = document.getElementById("alertExportCsv"),
  btnArchive = document.getElementById("btnArchive");

async function removeKarmand(id) {
  const response = await window.myApi.removeKarmand(id);
  if (response.isError) {
    console.log(response.msg);
  } else {
    if (response.msg == "deleted") {
      const result = await window.myApi.getKarmands();
      getKarmandsData(result);
    }
  }
}
async function editProfile(id) {
  document.body.classList.remove("animate__fadeOutLeft");
  document.body.classList.add("animate__faster");
  document.body.classList.add("animate__fadeOutLeft");
  document.body.addEventListener("animationend", () => {
    location.href = `./editProfile.html?id=${id}`;
  });
}

function gotoProfile(id) {
  document.body.classList.remove("animate__fadeOutLeft");
  document.body.classList.add("animate__faster");
  document.body.classList.add("animate__fadeOutLeft");
  document.body.addEventListener("animationend", () => {
    location.href = `./profile.html?id=${id}`;
  });
}
async function getKarmandsData(response) {
  const now = new Date();

  if (!response.isError) {
    let tabelBody = "";

    if (response.data.length > 0) {
      response.data.forEach(({ dataValues }) => {
        tabelBody += `
          <tr class="text-center h-[50px]">
              <td class="${
                now.getFullYear() == dataValues.dateOfBirth.getFullYear() &&
                now.getMonth() == dataValues.dateOfBirth.getMonth() &&
                now.getDay() == dataValues.dateOfBirth.getDay()
                  ? "text-red-700 font-bold"
                  : ""
              } ">${dataValues.name}</td>
              <td>${dataValues.jobName}</td>
              <td>${dataValues.email}</td>
              <td>
                <span class="${
                  response.status[dataValues.id] == "active"
                    ? "bg-green-500"
                    : response.status[dataValues.id] == "fire"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }  text-white p-1 rounded-md select-none"
                  >${
                    response.status[dataValues.id] == "active"
                      ? "فعال"
                      : response.status[dataValues.id] == "fire"
                      ? "اخراج شده"
                      : "مرخصی"
                  }</span
                >
              </td>
              <td>
                <button
                  onclick="removeKarmand('${dataValues.id}')"
                  class="cursor-pointer bg-red-500 transition-all hover:bg-red-400 text-white p-1 rounded-md select-none"
                >
                  حذف
                </button>
                <button
                   onclick="gotoProfile('${dataValues.id}')"
                  class="cursor-pointer bg-yellow-400 transition-all hover:bg-yellow-500 text-white p-1 rounded-md select-none"
                >
                  پروفایل
                </button>
                                <button
                   onclick="editProfile('${dataValues.id}')"
                  class="cursor-pointer bg-blue-400 transition-all hover:bg-blue-500 text-white p-1 rounded-md select-none"
                >
                  ویرایش
                </button>
              </td>
            </tr>`;
      });

      content.innerHTML = `
        <table class="w-full rounded-md overflow-hidden">
          <thead class="h-[50px]">
            <tr class="bg-stone-200">
              <th>نام</th>
              <th>عنوان شغلی</th>
              <th>ایمیل</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
              ${tabelBody}
          </tbody>
        </table>
      `;
    } else {
      content.innerHTML = `
        <h3 class="text-center">کارمندی یافت نشد </h3>
      `;
    }
  }
}

function navigtion(e, url) {
  e.preventDefault();

  document.body.classList.remove("animate__fadeOutLeft");
  document.body.classList.add("animate__faster");
  document.body.classList.add("animate__fadeOutLeft");
  document.body.addEventListener("animationend", () => {
    location.href = url;
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  const response = await window.myApi.getKarmands();
  getKarmandsData(response);
});

btnAddKarmand.addEventListener("click", (e) => {
  navigtion(e, "./add.html");
});

btnArchive.addEventListener("click", (e) => {
  navigtion(e, "./archive.html");
});

search.addEventListener("keyup", async (event) => {
  if (event.key == "Enter") {
    console.log("searching ...");
    const response = await window.myApi.search(event.target.value);
    if (response.isError) {
      alert(response.msg);
    } else {
      getKarmandsData(response);
    }
  }
});

exportCsv.addEventListener("click", async () => {
  const response = await window.myApi.exportCsv();

  if (response.isError) {
    alertExportCsv.innerHTML = response.msg;
    alertExportCsv.classList.remove("hidden");
    alertExportCsv.classList.remove("bg-green-500");
    alertExportCsv.classList.add("bg-red-500");

    setInterval(() => {
      alertExportCsv.classList.add("hidden");
    }, 5_000);
  } else {
    alertExportCsv.innerHTML = `فایل سی اس وی با ${response.record} رکورد ذخیره شد`;
    alertExportCsv.classList.remove("hidden");
    alertExportCsv.classList.remove("bg-red-500");
    alertExportCsv.classList.add("bg-green-500");

    setInterval(() => {
      alertExportCsv.classList.add("hidden");
    }, 5_000);
  }
});
