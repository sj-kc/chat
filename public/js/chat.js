const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

document.querySelector("#message_form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message_input.value;

  socket.emit("sendMessage", message, () => {
    console.log("Message delivered");
  });
});

document.querySelector("#send_location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition(({ coords }) => {
    const coordObj = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    socket.emit("sendLocation", coordObj, () => {
      console.log("Location Shared!");
    });
  });
});
