export interface IMimeType {
  ".html": string,
  ".ico": string,
  ".css": string,
  ".js": string,
  '.json': string,
  '.png': string,
  '.jpg': string,
  '.gif': string,
  '.wav': string,
  '.mp4': string,
  '.woff': string,
  '.ttf': string,
  '.eot': string,
  '.otf': string,
  '.svg': string
}

export const mimeTypes: IMimeType = {
  ".html": "text/html",
  ".ico": "image/vnd.microsoft.icon",
  ".css": "text/css",
  ".js": "text/javascript",
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.svg': 'application/image/svg+xml'
}