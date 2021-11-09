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

const uploader = new GhImgUploader({
  token: "",
  repos: "",
  owner: ""
});

uploader.upload([base64Img], [filename], [isPrefixWithHash])

```
