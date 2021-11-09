# Description

Upload base64 image to github by token compatible with nodejs and browser environment.

# Install

## with npm

```
npm i github-image-uploader
```

## with cdn

```
<script src="https://cdn.jsdelivr.net/npm/github-image-uploader/dist/index.min.js"></script>
```

# Usage

```
const { GhImgUploader } = require("github-image-uploader");

// Full options
const uploader = new GhImgUploader({
  token: "",
  owner: "",
  repos: "",
  dir: "/"
});

uploader.upload([base64Img], [filename], [isPrefixWithHash])

```

# ConstructorOption description

| Key   | Type   | Default | Description                                        |
| ----- | ------ | ------- | -------------------------------------------------- |
| token | string |         | required, github token                             |
| owner | string |         | required, github username                          |
| repos | string |         | required, github repos name                        |
| dir   | string | /       | optional, upload directory, by default is root dir |

# UploadOption description

| Key              | Type    | Default   | Description                                        |
| ---------------- | ------- | --------- | -------------------------------------------------- |
| base64Img        | string  |           | required                                           |
| filename         | string  | eg: x.jpg | required                                           |
| isPrefixWithHash | boolean | false     | optional, not prefix filename with hash by default |
