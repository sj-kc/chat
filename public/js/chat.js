const socket = io();

document.querySelector("#message_form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message_input.value;

  socket.emit("sendMessage", message);
});

socket.on("message", (message) => {
  console.log(message);
});
