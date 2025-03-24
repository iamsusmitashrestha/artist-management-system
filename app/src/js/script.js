import { ROLES } from "../constants/common.js";

document.addEventListener("DOMContentLoaded", function () {
  const user = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  if (!user) {
    window.location.href = "./pages/user/login.html";
  } else if (
    userRole === ROLES.SUPER_ADMIN ||
    userRole === ROLES.ARTIST_MANAGER
  ) {
    window.location.href = "./pages/user/dashboard.html";
  } else if (userRole === ROLES.ARTIST) {
    window.location.href = `./pages/user/song.html?artistId=${userId}`;
  }
});
