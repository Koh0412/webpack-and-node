import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import HttpStatus from "http-status-codes";

import { IMimeType, mimeTypes } from "../constants/mimeType";
import { CONTENT_TYPE_HTML, EXT_HTML, ROOT } from "../constants/system";
import { accessLog } from "../utils/functions";

export class ServerHandler {
  private staticDir: string;
  private request: http.IncomingMessage;
  private response: http.ServerResponse;

  private requestURL: string | undefined;
  private filePath: string;
  private _ext: string;

  constructor(req: http.IncomingMessage, res: http.ServerResponse) {
    this.staticDir = "./public";
    this.request = req;
    this.response = res;
    this.requestURL = this.request.url?.split("?")[0];

    this.filePath = this.staticDir + this.requestURL;
    if (this.isRoot) {
      this.filePath = this.staticDir + "/index.html";
    }

    this._ext = this.searchExtension(this.filePath);
    if (!this._ext) {
      this.filePath += EXT_HTML;
      this._ext = EXT_HTML;
    }
  }

  /**
   * urlがrootであるか
   */
  get isRoot(): boolean {
    return this.requestURL === ROOT;
  }

  /**
   * リクエストのurlの拡張子
   */
  private get extname() {
    return this._ext as keyof IMimeType;
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
    return mimeTypes[this.extname] || "";
  }

  /**
   * staticディレクトリを変更する default: ルート下のpublicディレクトリ
   * @param dir
   */
  setStaticDir(dir: string) {
    this.staticDir = dir;
  }

  //TODO: ここの処理自体を大きく変える必要ありそう
  /**
   * 静的なファイルをページに返す
   */
  returnStaticFile(): void {
    const readStream = fs.createReadStream(this.filePath);

    // エラー時処理
    readStream.on("error", (err) => this.dispNotFound(err));
    // 成功時処理
    readStream.on("data", (chunk) => {
      if (this.request.method === "GET") {
        this.outputData(chunk);
      }
      // TODO: 一時的なもの
      if (this.request.method === "POST") {
        this.redirectTo("/");
      }
    });
  }

  /**
   * not foundページを返す
   * @param err
   */
  private dispNotFound(err: Error): void {
    const notFound = fs.createReadStream(`${this.staticDir}/404.html`);
    notFound.on("data", (chunk) => this.outputData(chunk, HttpStatus.NOT_FOUND));
  }

  /**
   * レスポンスヘッダとチャンクデータを出力する
   * @param chunk
   * @param code
   */
  private outputData(chunk: string | Buffer, code: number = HttpStatus.OK): void {
    this.response.writeHead(code, {"Content-Type": this.contentType});
    this.response.end(chunk, "utf-8");
    if (this.isTypeHTML) {
      accessLog(this.request, this.response);
    }
  }

  private redirectTo(URL: string) {
    this.response.writeHead(HttpStatus.MOVED_TEMPORARILY, {
      "Content-Type": this.contentType,
      "Location": URL
    });
    this.response.end();
  }

  /**
   * 値の拡張子を調べる
   * @param value
   */
  private searchExtension(value: string): string {
    return path.extname(value).toLowerCase();
  }
}