export function showError(input, message) {
  const errorMessage = input.nextElementSibling;
  errorMessage.innerText = message;
  errorMessage.style.display = "block";
  valid = false;
}

export function clearError(input) {
  input.nextElementSibling.style.display = "none";
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
