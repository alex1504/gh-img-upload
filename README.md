# Description

Upload base64 image to github by token compatible with nodejs and browser environment.

# Install

## with npm

```
npm i GhImgUploader
```

## with cdn

todo

# Usage

```
const { GhImgUploader } = require("GhImgUploader");

const uploader = new GhImgUploader({
  token: "",
  repos: "",
  owner: ""
});

uploader.upload([base64Img], [filename], [isPrefixWithHash])

```
