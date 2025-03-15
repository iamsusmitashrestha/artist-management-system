export function showError(input, message) {
  const errorMessage = input.nextElementSibling;
  errorMessage.innerText = message;
  errorMessage.style.display = "block";
  valid = false;
}

export function clearError(input) {
  input.nextElementSibling.style.display = "none";
}
