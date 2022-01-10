# Description

Upload base64 image to github by token compatible with nodejs and browser environment.

# Install

## with npm

```
npm i github-image-uploader
```

## with cdn

```js
<script src="https://cdn.jsdelivr.net/npm/github-image-uploader@1.1.5/dist/index.min.js"></script>
```

# Usage

```typescript
const { GhImgUploader } = require("github-image-uploader");

const uploader = new GhImgUploader(options: IOptions);
uploader.upload(uploadOptions: IUploadOptions);
```

# IOptions

```typescript
export type IOptions = {
  token: string;
  owner: string;
  repos: string;
  dir?: string;
  branch?: string;
};
```

| Key    | Type   | Default | Description                                                       |
| ------ | ------ | ------- | ----------------------------------------------------------------- |
| token  | string |         | required, github token                                            |
| owner  | string |         | required, github username                                         |
| repos  | string |         | required, github repos name                                       |
| dir    | string |         | optional, upload directory, empty string means root dir. eg: sub/ |
| branch | string | master  | optional, upload branch, by default is master branch              |

# IUploadOptions

```typescript
export type IUploadOptions = {
  base64Img: string;
  filename: string;
  filenameHandler?: "hash" | "date" | ((filename: string) => string);
};
```

| Key             | Type             | Default | Description                                                                                              |
| --------------- | ---------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| base64Img       | string           |         | required                                                                                                 |
| filename        | string           |         | required, eg: x.jpg                                                                                      |
| filenameHandler | string, function |         | optional, "hash" or "date" will call inner built handler, you can pass custom handler by pass a function |
