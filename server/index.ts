import * as http from "http";
import { PORT_NUMBER } from "./constants/system";
import { ServerHandler } from "./modules/serverHandler";

const server: http.Server = http.createServer((req, res) => {
  const serverHandler = new ServerHandler(req, res);
  serverHandler.returnStaticFile();
});

console.log(`listening server port is ${PORT_NUMBER}...`);
server.listen(PORT_NUMBER);