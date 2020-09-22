import * as log4js from "log4js";

export const PORT_NUMBER = 8011;

export const CONTENT_TYPE_HTML = "text/html";
export const DEFAULT_CHARSET = "charset=utf-8"
export const ROOT = "/";
export const EXT_HTML = ".html";

export const logger = log4js.getLogger();
logger.level = "all";