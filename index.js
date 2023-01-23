const express = require("express");
const cors = require("cors");
const SocketIO = require("socket.io");
const cleverbot = require("cleverbot-free");
const config = require("./config");

const messages = [];

const app = express();
const server = app.listen(config.port, () =>
  console.log(`http://localhost:${config.port}`)
);

const io = new SocketIO.Server(server);

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("./pages/index.html", { root: "." });
});

app.get("/messages", (req, res) => {
  res.send(messages);
});

app.post("/chatai", async (req, res) => {
  let message = messages[messages.length - 1].content.substr(1);
  let answer;
  try {
    answer = await cleverbot(message, messages);
  } catch (error) {
    answer = error;
  }
  return res.send(answer).end();
});

io.on("connection", (socket) => {
  console.log(`${socket.id} connected!`);

  socket.on("messageCreate", (data) => {
    messages.push({
      author: {
        username: data.author,
        id: socket.id,
      },
      content: data.content,
      timestamp: Date.now(),
    });
    
    io.emit("messageCreate", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
