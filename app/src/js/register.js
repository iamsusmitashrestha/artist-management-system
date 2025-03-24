import { API_BASE_URL, RESPONSE_TYPE } from "../constants/common.js";
import { handleError, showToast } from "../utils/common.js";
import { validateUserForm } from "./validation.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fields = {
      firstName: document.getElementById("firstName"),
      lastName: document.getElementById("lastName"),
      email: document.getElementById("email"),
      password: document.getElementById("password"),
      phone: document.getElementById("phone"),
      role: document.getElementById("role"),
      dob: document.getElementById("dob"),
      address: document.getElementById("address"),
      gender: document.getElementById("gender"),
    };

    if (!validateUserForm(fields)) return;

    const userData = {
      firstName: fields.firstName.value,
      lastName: fields.lastName.value,
      email: fields.email.value,
      password: fields.password.value,
      phone: fields.phone.value,
      role: fields.role.value,
      dob: fields.dob.value,
      address: fields.address.value,
      gender: fields.gender.value,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );

      showToast(response.data.message, RESPONSE_TYPE.SUCCESS);
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);

      form.reset();
    } catch (error) {
      handleError(error);
    }
  });
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
