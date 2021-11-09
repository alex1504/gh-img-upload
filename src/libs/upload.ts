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
  branch?: string;
};

export type IUploadResponse = {
  commit: {
    author: {
      date: string;
      email: string;
      name: string;
    };
    committer: unknown;
    html_url: string;
    message: string;
    node_id: string;
    parents: unknown;
    sha: string;
    tree: unknown;
    url: string;
    verification: unknown;
  };
  content: {
    download_url: string;
    git_url: string;
    html_url: string;
    name: string;
    path: string;
    sha: string;
    size: number;
    type: string;
    url: string;
  };
};

export class GhImgUploader {
  public token;
  public owner;
  public repos;
  public dir;
  public branch;

  constructor(options: IOptions) {
    this.token = options.token;
    this.owner = options.owner;
    this.repos = options.repos;
    this.dir = options.dir ? options.dir : "";
    this.branch = options.branch ? options.branch : "master";
  }

  private _getPayload(data: IUploadPayload): string | Buffer {
    return isBrowserEnv
      ? JSON.stringify(data)
      : Buffer.from(JSON.stringify(data));
  }

  private getMd5(filename: string) {
    return md5(
      String(Math.floor(Math.random() * Math.pow(10, 9) + Date.now())) +
        filename
    );
  }

  public setBranch(branch: string) {
    this.branch = branch;

    return this;
  }

  public async upload(
    base64Img: string,
    filename: string,
    isHashFilename = false
  ) {
    const targetFilename = isHashFilename
      ? `${this.getMd5(filename)}-${filename}`
      : filename;

    const data = {
      message: "Upload pictures via github-image-uploader",
      branch: this.branch,
      content: base64Img
    };

    const res = await request<IUploadResponse>(
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
