import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import HttpStatus from "http-status-codes";

import { IMimeType, mimeTypes } from "../constants/mimeType";
import { CONTENT_TYPE_HTML, ROOT } from "../constants/system";
import { accessLog } from "../utils/functions";

export class ServerHandler {
  private staticDir: string;
  private request: http.IncomingMessage;
  private response: http.ServerResponse;

  constructor(req: http.IncomingMessage, res: http.ServerResponse) {
    this.staticDir = "./public";
    this.request = req;
    this.response = res;
  }

  /**
   * urlがrootであるか
   */
  get isRoot(): boolean {
    return this.request.url === ROOT;
  }

  /**
   * リクエストのurlにパブリックフォルダ名を付けて返す
   */
  get filePath(): string {
    let url = this.staticDir + this.request.url
    if (this.isRoot) {
      url = this.staticDir + "/index.html";
    }
    return url;
  }

  /**
   * リクエストのurlの拡張子
   */
  private get extname() {
    return path.extname(this.filePath).toLowerCase() as keyof IMimeType;
  }

  /**
   * コンテントタイプがtext/htmlであるか
   */
  private get isTypeHTML(): boolean {
    return this.contentType === CONTENT_TYPE_HTML;
  }

  /**
   * コンテントタイプ
   */
  private get contentType(): string {
    if (!this.extname) {
      return CONTENT_TYPE_HTML;
    }
    return mimeTypes[this.extname] || "";
  }

  /**
   * staticディレクトリを変更する default: ルート下のpublicディレクトリ
   * @param dir
   */
  setStaticDir(dir: string) {
    this.staticDir = dir;
  }

  /**
   * 静的なファイルをページに返す
   */
  returnStaticFile(): void {
    const readStream = fs.createReadStream(this.filePath);

    // エラー時処理
    readStream.on("error", (err) => this.dispNotFound(err));
    // 成功時処理
    readStream.on("data", (chunk) => this.redirectResponse(chunk));
  }

  /**
   * not foundページを返す
   * @param err
   */
  private dispNotFound(err: Error): void {
    const notFound = fs.createReadStream(`${this.staticDir}/404.html`);
    notFound.on("data", (chunk) => this.redirectResponse(chunk, HttpStatus.NOT_FOUND));
  }

  /**
   * レスポンスヘッダとチャンクデータを返す
   * @param chunk
   * @param code
   */
  private redirectResponse(chunk: string | Buffer, code: number = HttpStatus.OK): void {
    this.response.writeHead(code, {"Content-Type": this.contentType});
    this.response.end(chunk, "utf-8");
    if (this.isTypeHTML) {
      accessLog(this.request, this.response);
    }
  }
}