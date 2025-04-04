import { API_BASE_URL, ROLES } from "../constants/common.js";
import { handleError, showToast } from "../utils/common.js";

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userRole", response.data.role);

        if (response.data.role === ROLES.ARTIST) {
          window.location.href = `song.html?artistId=${response.data.artistId}`;
        } else {
          window.location.href = "dashboard.html";
        }
        showToast(response.data.message, RESPONSE_TYPE.SUCCESS);
      } else {
        showToast(response.data.message, RESPONSE_TYPE.ERROR);
      }
    } catch (error) {
      handleError(error);
    }
  });

// Toggle password visibility
document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    passwordField.type =
      passwordField.type === "password" ? "text" : "password";
    this.src =
      passwordField.type === "password"
        ? "https://cdn-icons-png.flaticon.com/512/159/159604.png"
        : "https://cdn-icons-png.flaticon.com/512/565/565655.png";
  });

// Redirect to dashboard if already logged in
if (localStorage.getItem("authToken")) {
  window.location.href = "dashboard.html";
}
