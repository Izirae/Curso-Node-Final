const socket = io();
let user;

const chatbox = document.getElementById("chatbox");
const messageLogs = document.getElementById("messageLogs");
const button = document.getElementById("enviar");

async function usuario() {
  await fetch("/api/sessions/current", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((json) => {
      user = json.email
    })

  if (!user) {
    Swal.fire({
      title: "Ingrese su email",
      input: "text",
      inputValidator: (value) => {
        return !value && "Necesitas escribir un email para identificarte";
      },
      allowOutsideClick: false,
    }).then((result) => {

      user = result.value;
      socket.emit("authenticatedUser", user);
    });
  } else {
    socket.emit("authenticatedUser", user);
  }
}

function enviar() {
  socket.emit("message", { user: user, message: chatbox.value });
  chatbox.value = "";
}

chatbox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    enviar()
  }
});

button.onclick = () => {
  enviar()
}

socket.on("imprimir", (data) => {
  let mensajes = "";
  data.forEach((msj) => {
    mensajes += `<b>${msj.user}:</b> ${msj.message} <br/>`;
  });
  messageLogs.innerHTML = mensajes;
});

socket.on("newUserAlert", (data) => {
  if (!user) return;
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    title: data + " se ha unido al chat",
    icon: "success",
  });
});

usuario()