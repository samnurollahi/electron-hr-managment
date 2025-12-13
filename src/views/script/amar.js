window.addEventListener("DOMContentLoaded", async () => {
  const response = await window.myApi.amar();

  if (response.isError) {
    alert(response.msg);
  } else {
    sum.innerHTML = response.sum;
    active.innerHTML = response.status.active;
    fire.innerHTML = response.status.fire;
    leave.innerHTML = response.status.leave;
    totalSalary.innerHTML = response.totalSalary;
  }
});
