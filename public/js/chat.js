const socket = io();

// Elements
const $messageForm = document.querySelector("#message_form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.querySelector("#send_location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("message", ({ message, createdAt, username }) => {
  const html = Mustache.render(messageTemplate, {
    message,
    createdAt: moment(createdAt).format("h:mm:a"),
    username,
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", ({ url, createdAt, username }) => {
  const html = Mustache.render(locationTemplate, {
    url,
    createdAt: moment(createdAt).format("h:mm:a"),
    username,
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });

  document.querySelector("#sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled");
  const message = e.target.elements.message_input.value;
  $messageFormInput.value = "";
  $messageFormInput.focus();

  socket.emit("sendMessage", message, () => {
    $messageFormButton.removeAttribute("disabled");
    console.log("Message delivered");
  });
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }

  $sendLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(({ coords }) => {
    const coordObj = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    socket.emit("sendLocation", coordObj, () => {
      console.log("Location Shared!");
      $sendLocationButton.removeAttribute("disabled");
    });
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
