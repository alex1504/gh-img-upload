export const isBrowserEnv = typeof window !== "undefined";

export function request(url: string, options?: any): Promise<any> {
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
        require("axios")(url, options).then((res: any) => {
          resolve(res.data);
        });
      } catch (e) {
        reject(e);
      }
    }
  });
}
