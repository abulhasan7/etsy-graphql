const { v4: uuidv4 } = require("uuid");
// const fs = require("fs");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({signatureVersion: 'v4',region: 'us-east-2'});
AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
});
// AWS.config.update({accessKeyId: 'AKIAZLDRU2VAYD2SH6GG', secretAccessKey: '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'})

// Tried with and without this. Since s3 is not region-specific, I don't
// think it should be necessary.
// AWS.config.update({region: 'us-east-2'})

const myBucket = process.env.bucketName;

const signedUrlExpireSeconds = 60 * 10;
const generateSignedUrl = () => {
  return s3.getSignedUrl("putObject", {
    Bucket: myBucket,
    Key: 'profile-pics/'+uuidv4(),
    Expires: signedUrlExpireSeconds,
  });
};

module.exports = { generateSignedUrl };
