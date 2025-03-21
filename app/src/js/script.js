document.addEventListener("DOMContentLoaded", function () {
  const user = localStorage.getItem("authToken");

  if (user) {
    window.location.href = "./pages/user/dashboard.html";
  } else {
    window.location.href = "./pages/user/login.html";
  }
});
