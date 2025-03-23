import { showToast } from "./toast.js";
import { clearError, showError } from "../utils/common.js";
import { API_BASE_URL, RESPONSE_TYPE } from "../constants/common.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let valid = true;

    // Collect form data
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const phone = document.getElementById("phone");
    const role = document.getElementById("role");
    const dob = document.getElementById("dob");
    const address = document.getElementById("address");
    const gender = document.getElementById("gender");

    if (firstName.value.trim() === "") {
      showError(firstName, "First name is required.");
      valid = false;
    } else clearError(firstName);

    if (lastName.value.trim() === "") {
      showError(lastName, "Last name is required.");
      valid = false;
    } else clearError(lastName);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.value)) {
      showError(email, "Enter a valid email.");
      valid = false;
    } else clearError(email);

    if (password.value.length < 6) {
      showError(password, "Password must be at least 6 characters.");
      valid = false;
    } else clearError(password);

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone.value)) {
      showError(phone, "Enter a valid 10-digit phone number.");
      valid = false;
    } else clearError(phone);

    if (role.value === "") {
      showError(role, "Please select a role.");
      valid = false;
    } else clearError(role);

    if (!valid) return;

    // Prepare request payload
    const userData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      phone: phone.value,
      role: role.value,
      dob: dob.value,
      address: address.value,
      gender: gender.value,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );
      window.location.href = "login.html";

      // if (response.status === statusCodes.CREATED) {
      //   showToast("Registration successful!", RESPONSE_TYPE.SUCCESS);
      //   // navigateTo("/login");
      //   // form.reset();
      // }
    } catch (error) {
      console.log(error);
      // showToast("Something went wrong");
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
