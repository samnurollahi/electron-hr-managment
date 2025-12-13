const alertBox = document.getElementById("alertBox"),
  btnSubmit = document.getElementById("btnSubmit");

const id = location.search.split("?")[1].split("=")[1];

window.addEventListener("DOMContentLoaded", async () => {
  const response = await window.myApi.getKarmand(id);

  if (response.isError) {
    alertBox.classList.add("bg-red-500");
    alertBox.classList.remove("bg-green-500");
    alertBox.classList.remove("hidden");
    alertBox.innerHTML = response.msg;
  } else {
    const { karmand } = response;
    const { dataValues } = karmand;

    nameInput.value = dataValues.name;
    jobName.value = dataValues.jobName;
    age.value = dataValues.age;
    dateOfBirth.value = dataValues.dateOfBirth;
    dateJoin.value = dataValues.dateJoin;
    email.value = dataValues.email;
    phoneNumber.value = dataValues.phoneNumber;
    skills.value = dataValues.skills;
  }
});

btnSubmit.addEventListener("click", async (e) => {
  e.preventDefault();
  const response = await window.myApi.editKarmand({
    id,
    data: {
      name: nameInput.value,
      jobName: jobName.value,
      age: age.value,
      dateOfBirth: dateOfBirth.value,
      dateJoin: dateJoin.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      skills: skills.value,
    },
  });

  if (response.isError) {
    alertBox.classList.add("bg-red-500");
    alertBox.classList.remove("bg-green-500");
    alertBox.classList.remove("hidden");
    alertBox.innerHTML = response.msg;
  } else {
    alertBox.classList.remove("bg-red-500");
    alertBox.classList.add("bg-green-500");
    alertBox.classList.remove("hidden");
    alertBox.innerHTML = "ویرایش با موفقیت انجام شد!";
  }
});
