import { clearError, showError } from "../utils/common.js";

export const validateUserForm = (fields, isUpdate) => {
  let valid = true;

  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    dob,
    address,
    gender,
    role,
  } = fields;

  if (firstName.value.trim() === "") {
    showError(firstName, "First name is required.");
    valid = false;
  } else clearError(firstName);

  if (lastName.value.trim() === "") {
    showError(lastName, "Last name is required.");
    valid = false;
  } else clearError(lastName);

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (email.value.trim() === "") {
    showError(email, "Email is required.");
    valid = false;
  } else if (!emailPattern.test(email.value)) {
    showError(email, "Enter a valid email.");
    valid = false;
  } else clearError(email);

  if (!isUpdate) {
    if (password.value.trim() === "") {
      showError(password, "Password is required.");
      valid = false;
    } else if (password.value.length < 6) {
      showError(password, "Password must be at least 6 characters.");
      valid = false;
    } else clearError(password);
  }

  const phonePattern = /^[0-9]{10}$/;
  if (phone.value.trim() === "") {
    showError(phone, "Phone number is required.");
    valid = false;
  } else if (!phonePattern.test(phone.value)) {
    showError(phone, "Enter a valid 10-digit phone number.");
    valid = false;
  } else clearError(phone);

  if (dob.value.trim() === "") {
    showError(dob, "Date of birth is required.");
    valid = false;
  } else if (new Date(dob.value) > new Date()) {
    showError(dob, "Date of birth cannot be in the future.");
    valid = false;
  } else clearError(dob);

  if (address.value.trim() === "") {
    showError(address, "Address is required.");
    valid = false;
  } else clearError(address);

  if (gender.value === "") {
    showError(gender, "Please select a gender.");
    valid = false;
  } else clearError(gender);

  if (role.value === "") {
    showError(role, "Please select a role.");
    valid = false;
  } else clearError(role);

  return valid;
};
