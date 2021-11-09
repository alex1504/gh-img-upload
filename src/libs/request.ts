import { AxiosResponse } from "axios";

export const isBrowserEnv = typeof window !== "undefined";

export type IRequestOptions = {
  method: string;
  data: string | Buffer;
  headers: {
    [key: string]: string;
  };
};

export function request<T>(url: string, options: IRequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    if (typeof XMLHttpRequest !== "undefined") {
      const xhr = new XMLHttpRequest();
      xhr.open(options.method, url);
      xhr.setRequestHeader("Content-Type", options.headers["Content-Type"]);
      xhr.setRequestHeader("Authorization", options.headers.Authorization);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          try {
            resolve(JSON.parse(xhr.responseText));
          } catch (e) {
            reject(e);
          }
        }
      };
      xhr.onerror = () => {
        reject(xhr.responseText);
      };

      xhr.send(options.data);
    } else {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require("axios")(url, options).then((res: AxiosResponse<T>) => {
          resolve(res.data);
        });
      } catch (e) {
        reject(e);
      }
    }
  });
}
