import jalaali from "https://cdn.skypack.dev/jalaali-js";
import jMoment from "https://cdn.skypack.dev/moment-jalaali";

const alertBox = document.getElementById("alertBox"),
  autoAddExcel = document.getElementById("autoAddExcel"),
  dasti = document.getElementById("dasti"),
  content = document.getElementById("content");

const obj = {};

autoAddExcel.addEventListener("click", () => {
  autoAddExcel.classList.remove("bg-stone-300");
  autoAddExcel.classList.add("bg-blue-500");
  autoAddExcel.classList.add("text-white");

  dasti.classList.add("bg-stone-300");
  dasti.classList.remove("bg-blue-500");
  dasti.classList.remove("text-white");

  alertBox.classList.add("hidden");

  function importData(path) {
    console.log(path);
  }

  content.innerHTML = `  <label
            for=""
            id="selectExcel"
            class="p-5 border w-[300px] m-auto cursor-pointer rounded-lg flex justify-center items-center"
            >انتخاب فایل اکسل</label
          >`;

  const label = document.getElementById("selectExcel");

  label.addEventListener("click", async () => {
    const response = await window.myApi.selectFile();
    if (!response.canceled) {
      content.innerHTML += `<button
            id="importExcel"
            class="bg-green-700 text-white py-2 px-4 rounded-md cursor-pointer mt-3 block m-auto"
          >
            وارد کردن
          </button>`;
      console.log(response);
    }

    const importExcel = document.getElementById("importExcel");
    importExcel.addEventListener("click", async () => {
      const result = await window.myApi.importExcel(response.filePaths[0]);
      if (result.isError) {
        alertBox.classList.remove("hidden");
        alertBox.classList.add("bg-red-500");
        alertBox.classList.remove("bg-green-500");
        alertBox.innerHTML = "در دریافت کارمندان به مشکل خوردیم";
      } else {
        alertBox.classList.remove("hidden");
        alertBox.classList.remove("bg-red-500");
        alertBox.classList.add("bg-green-500");
        alertBox.innerHTML = result.msg;
      }
    });
  });
});
dasti.addEventListener("click", () => {
  autoAddExcel.classList.add("bg-stone-300");
  autoAddExcel.classList.remove("bg-blue-500");
  autoAddExcel.classList.remove("text-white");

  dasti.classList.remove("bg-stone-300");
  dasti.classList.add("bg-blue-500");
  dasti.classList.add("text-white");

  alertBox.classList.add("hidden");
  content.innerHTML = `
          <form class="animate__animated animate__fadeIn">
            <div class="flex flex-wrap items-center justify-center">
              <div class="flex flex-col ml-10 mb-8">
                <label for="name">نام: </label>
              <input
                required
                id="nameInput"
                type="text"
                placeholder="سام نورالهی ..."
                class="outline-0 border-2 border-stone-100 rounded-md bg-stone-100 transition-all focus:bg-white py-2 px-2"
              />
            </div>
            <div class="flex flex-col ml-10 mb-8">
              <label for="jobName">عنوان شغلی: </label>
              <input
                required
                id="jobName"
                type="text"
                placeholder="برنامه نویس فرانت اند  ..."
                class="outline-0 border-2 border-stone-100 rounded-md bg-stone-100 transition-all focus:bg-white py-2 px-2"
              />
            </div>
            <div class="flex flex-col ml-10 mb-8">
              <label for="age"> سن: </label>
              <input
                required
                id="age"
                type="number"
                min="17"
                max="99"
                class="outline-0 border-2 border-stone-100 rounded-md bg-stone-100 transition-all focus:bg-white py-2 px-2"
              />
            </div>
            <div class="flex flex-col ml-10 mb-8">
              <label for="dateOfBirth">تاریخ تولد : </label>
              <input
                required
                id="dateOfBirth"
                type="text"
                data-jdp
                class="outline-0 border-2 border-stone-100 rounded-md bg-stone-100 transition-all focus:bg-white py-2 px-2"
              />
            </div>
            <div class="flex flex-col ml-10 mb-8">
              <label for="dateJoin">تاریخ عضویت در شرکت : </label>
              <input
                required
                id="dateJoin"
                type="text"
                data-jdp
                class="outline-0 border-2 border-stone-100 rounded-md bg-stone-100 transition-all focus:bg-white py-2 px-2"
              />
            </div>
            <div class="flex flex-col ml-10 mb-8">
              <label for="email">ایمیل کارمند: </label>
              <input
                required
                id="email"
                type="email"
                class="outline-0 border-2 border-stone-100 rounded-md bg-stone-100 transition-all focus:bg-white py-2 px-2"
              />
            </div>
            <div class="flex flex-col ml-10 mb-8">
              <label for="phoneNumber">شماره تلفن: </label>
              <input
                required
                id="phoneNumber"
                type="tel"
                class="outline-0 border-2 border-stone-100 rounded-md bg-stone-100 transition-all focus:bg-white py-2 px-2"
              />
            </div>
            <div class="flex flex-col ml-10 mb-8">
              <label for="skills">مهارت ها : </label>
              <input
                required
                id="skills"
                type="text"
                class="outline-0 border-2 border-stone-100 rounded-md bg-stone-100 transition-all focus:bg-white py-2 px-2"
              />
            </div>
          </div>

          <button
            type="submit"
            id="btnSubmit"
            class="bg-blue-500 text-white px-4 py-2 rounded-md m-auto block transition-all hover:bg-blue-400 cursor-pointer"
          >
            اضافه کردن
          </button>
        </form>`;

  const btnSubmit = document.getElementById("btnSubmit");
  btnSubmit.addEventListener("click", async (e) => {
    e.preventDefault();

    obj.name = nameInput.value;
    obj.jobName = jobName.value;
    obj.age = age.value;
    obj.dateJoin = dateJoin.value;
    obj.email = email.value;
    obj.phoneNumber = phoneNumber.value;
    obj.skills = skills.value;

    let moment = jMoment(dateOfBirth.value, "jYYYY/jM/jD");
    let gregorian = moment.format("YYYY/M/D");
    obj.dateOfBirth = gregorian;
    console.log(gregorian);

    const response = await window.myApi.add(obj);
    if (response.isError) {
      alertBox.classList.remove("hidden");
      alertBox.classList.add("bg-red-500");
      alertBox.classList.remove("bg-green-500");
      alertBox.innerText = response.msg;
    } else {
      alertBox.classList.remove("hidden");
      alertBox.classList.remove("bg-red-500");
      alertBox.classList.add("bg-green-500");
      alertBox.innerHTML = "کارمند با موفقیت اضافه شد";
    }
  });
});
