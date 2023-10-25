const form = document.getElementById("resetPasswordForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  fetch("/api/sessions/resetPassword", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) {
      Swal.fire({
        icon: "success",
        title: "La contraseña ha sido restaurada",
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: `Hubo un error`,
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  });
});
