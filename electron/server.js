
const express = require('express');
const portfinder = require('portfinder');
const path = require('path');
const appRootDir = require('app-root-dir');

const _server = express();

const root = path.join(appRootDir.get(), 'build');

let Server = {
  scheme: "http",
  hostname: "127.0.0.1",
  port: 3000,
};

async function findPort(start = 8000) {
  return await portfinder.getPortPromise({
    port: start,
  });
};

Server.start = async function (port) {
  Server.port = await findPort(port);
  _server.use(express.static(root));
  _server.listen(Server.port, Server.hostname, () => {
    console.log(`Server running at ${Server.basePath}/`);
  });
}

Object.defineProperty(Server, 'basePath', {
  get: function () {
    return `${Server.scheme}://${Server.hostname}:${Server.port}`;
  }
})

_server.get('/', (req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

_server.get('/websocket', (req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

_server.get('/resister-divider', (req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

module.exports = Server;