// Remember to set init options for test.

const { GhImgUploader } = require("../../dist/index.umd.js");

const uploader = new GhImgUploader({
  token: "",
  repos: "",
  owner: ""
});

uploader
  .upload({
    filename: "",
    base64Img: ""
  })
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  });
