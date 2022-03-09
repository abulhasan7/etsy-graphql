// Load the SDK for JavaScript
var S3 = require("aws-sdk/clients/s3");
const fs = require("fs");

let s3 = new S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});

function upload(file) {
  console.log("filedetails", file);
  const filestream = fs.createReadStream(file.path);
  const params = {
    Body: filestream,
    Key: "profile-pics/" + file.originalname,
    Bucket: process.env.bucketName,
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        console.log("Error", err);
        reject(err);
      }
      if (data) {
        console.log("Upload Success", data.Location);
        fs.unlink(file.path, (err) => {
          if (err != null) {
            console.error("error occured during deleting file", err);
          }
        });
        resolve(data);
      }
    });
  });
}

function download() {

}

module.exports = { upload, download };
