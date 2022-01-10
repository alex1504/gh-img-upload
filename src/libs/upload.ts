import { filenameDateHandler, filenameHashHandler } from "./handler";
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
  content: IResponseContent;
};

export type IResponseContent = {
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

export enum ExternalLinkType {
  github = "GITHUB",
  githubMarkdown = "MARKDOWN_GITHUB",
  githubHtml = "HTML_GITHUB",
  jsdelivr = "CDN",
  jsdelivrMarkdown = "MARKDOWN_CDN",
  jsdelivrHtml = "HTML_CDN"
}

export type IUploadOptions = {
  base64Img: string;
  filename: string;
  filenameHandler?: "hash" | "date" | ((filename: string) => string);
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
    this.dir = this.handleDir(options.dir);
    this.branch = options.branch ? options.branch : "master";
  }

  private handleDir(dir: string | undefined) {
    if (dir === "/" || !dir) {
      return "";
    }

    const lastChar = dir.charAt(dir.length - 1);
    if (lastChar !== "/") {
      dir += "/";
    }

    return dir.replace(/^\/+/g, "").replace(/\/+/g, "/");
  }

  private getHandleFilename(filename: string) {
    const splitIndex = filename.indexOf(".");
    return filename.substr(0, splitIndex);
  }

  private generateExternalLink(
    type: ExternalLinkType,
    content: IResponseContent
  ) {
    const ghLink: string = decodeURI(content.download_url);
    const cdnLink = `https://cdn.jsdelivr.net/gh/${this.owner}/${this.repos}@${this.branch}/${content.path}`;

    switch (type) {
      case ExternalLinkType.github:
        return ghLink;

      case ExternalLinkType.githubMarkdown:
        return `![${this.getHandleFilename(content.name)}](${ghLink})`;

      case ExternalLinkType.githubHtml:
        return `<img src="${ghLink}" alt="${this.getHandleFilename(
          content.name
        )}">`;

      case ExternalLinkType.jsdelivr:
        return cdnLink;

      case ExternalLinkType.jsdelivrMarkdown:
        return `![${this.getHandleFilename(content.name)}](${cdnLink})`;

      case ExternalLinkType.jsdelivrHtml:
        return `<img src="${cdnLink}" alt="${this.getHandleFilename(
          content.name
        )}">`;
    }
  }

  private _getPayload(data: IUploadPayload): string | Buffer {
    return isBrowserEnv
      ? JSON.stringify(data)
      : Buffer.from(JSON.stringify(data));
  }

  public setBranch(branch: string) {
    this.branch = branch;

    return this;
  }

  public async upload(options: IUploadOptions) {
    const { base64Img, filename, filenameHandler } = options;

    const handlerMap = {
      hash: filenameHashHandler,
      date: filenameDateHandler
    };

    let targetFilename = filename;
    if (typeof filenameHandler === "function") {
      targetFilename = filenameHandler.call(this, filename);
    } else if (typeof filenameHandler === "string") {
      const handler = handlerMap[filenameHandler];

      if (typeof handler === "function") {
        targetFilename = handler.call(this, filename);
      }
    }

    const encodeTargetFilename = encodeURIComponent(targetFilename);
    const data = {
      message: "Upload pictures via github-image-uploader",
      branch: this.branch,
      content: base64Img
    };

    const res = await request<IUploadResponse>(
      `${githubBaseURL}/repos/${this.owner}/${this.repos}/contents/${this.dir}${encodeTargetFilename}`,
      {
        method: "PUT",
        data: this._getPayload(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${this.token}`
        }
      }
    );

    if (!res.content) {
      return res;
    }

    const content = res.content;
    const uploadRes = {
      raw: res,
      githubRaw: this.generateExternalLink(ExternalLinkType.github, content),
      githubMarkdown: this.generateExternalLink(
        ExternalLinkType.githubMarkdown,
        content
      ),
      githubHtml: this.generateExternalLink(
        ExternalLinkType.githubHtml,
        content
      ),
      jsdelivrRaw: this.generateExternalLink(
        ExternalLinkType.jsdelivr,
        content
      ),
      jsdelivrMarkdown: this.generateExternalLink(
        ExternalLinkType.jsdelivrMarkdown,
        content
      ),
      jsdelivrHtml: this.generateExternalLink(
        ExternalLinkType.jsdelivrHtml,
        content
      )
    };

    return uploadRes;
  }
}
