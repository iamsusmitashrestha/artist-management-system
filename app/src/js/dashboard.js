document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("authToken");
      window.location.href = "login.html";
    });
  } else {
    console.error("Logout button not found!");
  }
});

let tabButtons = document.querySelectorAll(".tab");

tabButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.remove("active");
    });

    button.classList.add("active");

    document.querySelectorAll(".tabPanel").forEach((panel) => {
      panel.classList.remove("active");
    });

    let target = button.dataset.tabTarget;

    document.querySelector(target).classList.add("active");
  });
});
