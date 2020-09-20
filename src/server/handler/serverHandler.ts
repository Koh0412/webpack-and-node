import * as http from "http";
import * as fs from "fs";
import * as path from "path";
import { IMimeType, mimeTypes } from "../constants/mimeType";

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
    return this.request.url === "/";
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
   * コンテントタイプ
   */
  private get contentType(): string {
    return mimeTypes[this.extname] || "application/octet-stream";
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
    readStream.on("data", (chunk) => this.responseOK(chunk));
  }

  /**
   * not foundページを返す
   * @param err
   */
  private dispNotFound(err: Error): void {
    const notFound = fs.createReadStream(`${this.staticDir}/404.html`);
    notFound.on("data", (chunk) => this.responseOK(chunk));
  }

  /**
   * ステータスコード200とチャンクを返す
   * @param chunk
   */
  private responseOK(chunk: string | Buffer): void {
    this.response.writeHead(200, {"Content-Type": this.contentType});
    this.response.end(chunk, "utf-8");
  }
}