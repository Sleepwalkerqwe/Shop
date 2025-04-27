const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

console.log("Cloudinary ENV:", cloud_name, api_key, api_secret);
cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

module.exports = (image) => {
  return new Promise((resolve, reject) => {
    console.log("image start:", image.slice(0, 100));

    cloudinary.uploader.upload(image, opts, (error, result) => {
      console.log(122131);

      if (result && result.secure_url) return resolve(result.secure_url);

      console.log(123123);
      return reject({ message: error.message });
    });
  });
};
