import * as http from "http";
import { logger } from "../constants/system";

export function accessLog(req: http.IncomingMessage, res: http.ServerResponse) {
  logger.info(`${req.method} ${req.url} HTTP/${req.httpVersion} - status: ${res.statusCode}`);
}