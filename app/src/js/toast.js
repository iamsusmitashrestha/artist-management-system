export function showToast({ text, type }) {
  Toastify({
    text,
    duration: 2000,
    gravity: "top",
    position: "right",
    backgroundColor: type === "success" ? "green" : "red",
    stopOnFocus: true,
    close: true,
  }).showToast();
}
