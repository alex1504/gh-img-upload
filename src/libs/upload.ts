import md5 from "md5";
import { request } from "./request";

const isBrowserEnv = typeof window !== "undefined";
const githubBaseURL = "https://api.github.com";

export interface IUploadPayload {
  message: string;
  branch: string;
  content: string;
}

export type IOptions = {
  token: string;
  owner: string;
  repos: string;
  dir?: string;
};

export class GhImgUploader {
  public token;
  public owner;
  public repos;
  public dir;

  constructor(options: IOptions) {
    this.token = options.token;
    this.owner = options.owner;
    this.repos = options.repos;
    this.dir = options.dir ? options.dir : "";
  }

  private _getPayload(data: IUploadPayload): string | Buffer {
    return isBrowserEnv
      ? JSON.stringify(data)
      : Buffer.from(JSON.stringify(data));
  }

  private getMd5() {
    return md5(Math.floor(Math.random() * Math.pow(10, 9) + Date.now()));
  }

  public async upload(
    base64Img: string,
    filename: string,
    isHashFilename = false
  ) {
    const targetFilename = isHashFilename
      ? `${this.getMd5()}-${filename}`
      : filename;

    const data = {
      message: "Upload pictures via github-image-upload",
      branch: "master",
      content: base64Img
    };

    const res = await request(
      `${githubBaseURL}/repos/${this.owner}/${this.repos}/contents/${this.dir}${targetFilename}`,
      {
        method: "PUT",
        data: this._getPayload(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${this.token}`
        }
      }
    );

    return res;
  }
}
