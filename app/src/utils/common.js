export function showError(inputElement, message) {
  const errorMessage = inputElement
    .closest(".input-group")
    .querySelector(".error-message");
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    inputElement.classList.add("error");
  }
}

export function clearError(inputElement) {
  const errorMessage = inputElement.nextElementSibling;
  errorMessage.textContent = "";
  errorMessage.style.display = "none";
  inputElement.classList.remove("error");
}

export function showToast(message, type) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    style: {
      backgroundColor: type === "success" ? "green" : "red",
      color: "#fff",
      maxWidth: "300px",
      width: "auto",
      padding: "10px",
    },
    stopOnFocus: true,
    close: true,
  }).showToast();
}

export function handleError(error, inputElement = null) {
  if (error.response) {
    const errorMessage =
      error.response.data.message ||
      error.response.data.error ||
      "An error occurred.";

    showToast(errorMessage, "error");

    // If an input element is provided, show the error message for that field
    if (inputElement) {
      showError(inputElement, errorMessage);
    }
  } else if (error.request) {
    showToast("No response from the server. Please try again later.", "error");
  } else {
    showToast(error.message || "An unexpected error occurred.", "error");
  }
}

export function formatDOB(dateString) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid Date";

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  const suffix = (day) => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${suffix(day)} ${month} ${year}`;
}
