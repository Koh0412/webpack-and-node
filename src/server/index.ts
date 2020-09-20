import * as http from "http";
import { ServerHandler } from "./handler/serverHandler";

const PORT = 8011;

const server: http.Server = http.createServer((req, res) => {
  const serverHandler = new ServerHandler(req, res);
  serverHandler.returnStaticFile();
});

server.listen(PORT);