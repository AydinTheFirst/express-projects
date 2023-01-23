var socket = io();

var messages = document.getElementById("messages");
var chat_container = document.getElementById("chat-container");
var login_panel = document.getElementById("login-panel");
var chat_window = document.getElementById("chat-window");
var chat_form = document.getElementById("form");

var username = "Visitor";
//Login
function login() {
  username = document.getElementById("username").value;
  chat_container.style.display = "block";
  login_panel.style.display = "none";
}

// Send Messages
chat_form.addEventListener("submit", (e) => {
  e.preventDefault();

  var msg_box = document.getElementById("msg_box");

  if (!msg_box.value) {
    return alert("Cannot send an empty message!");
  }

  socket.emit("messageCreate", {
    content: msg_box.value,
    author: username,
  });

  msg_box.value = "";
});

// Handle Messages
socket.on("messageCreate", async (msg) => {
  var item = document.createElement("p");
  if (username === msg.author) {
    item.style.backgroundColor = "#90B77D";
  }
  item.innerText = `${msg.author}: ${msg.content}`;
  messages.appendChild(item);

  if (username !== msg.author) {
    messageAlert();
  }
  
  chat_window.scrollTo(0, chat_window.scrollHeight);
});

// AI
function replyWithAI() {
  var ai = document.createElement("p");
  ai.style.backgroundColor = "#3F0071";
  ai.innerText = `🤖(${username}) is thinking...`;
  fetch("/chatai", {
    method: "post",
  })
    .then((res) => {
      res.text().then((answer) => {
        ai.innerText = `🤖(${username}): ${answer}`;
      });
    })
    .catch((e) => {
      console.log(e);
      ai.style.backgroundColor = "red";
      ai.innerText = `🤖(${username}): ${e}`;
    });
  messages.appendChild(ai);
}

function messageAlert() {
  var audio = new Audio("/sounds/message_alert.mp3");
  audio.play();
}

window.addEventListener("load", (e) => {
  // Disable Chat
  chat_container.style.display = "none";

  // Fetch Old Messages
  fetch("/messages")
    .then(async (data) => {
      data = JSON.parse(await data.text());
      data.map((msg) => {
        var item = document.createElement("p");
        item.innerText = `${msg.author.username}: ${msg.content}`;
        messages.appendChild(item);
      });
    })
    .catch(console.error);
});
