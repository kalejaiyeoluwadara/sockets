const http = require("http");
const { WebSocketServer } = require("ws");
const { v4: uuidv4 } = require("uuid");
const url = require("url");

const server = http.createServer((req, res) => {});
const wsServer = new WebSocketServer({ server });
const port = 8000;
const connections = {};
const users = {};

const broadcast = () => {
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message);
  });
};

const handleMessages = (bytes, uuid) => {
  const message = JSON.parse(bytes.toString());
  users[uuid].state = message;
  broadcast();
  console.log(message);
};

const handleClose = (uuid) => {
  console.log(`User ${users[uuid].username} disconnected`);
  delete connections[uuid];
  delete users[uuid];
  broadcast();
};

wsServer.on("connection", (connection, request) => {
  const { username } = url.parse(request.url, true).query;
  const uuid = uuidv4();
  console.log(`User ${username} connected`);
  console.log(uuid);
  connections[uuid] = connection;

  users[uuid] = {
    username,
    state: {},
  };

  connection.on("message", (message) => handleMessages(message, uuid));
  connection.on("close", () => handleClose(uuid)); // Corrected line
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
