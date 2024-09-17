const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dzrc9ejln",
  api_key: "363267481229718",
  api_secret: "Kihl35YQ4NQQoaClDbcu7VaC_yI",
});
// cloudinary.config({
//   cloud_name: "dlxxvqogg",
//   api_key: "839284896822179",
//   api_secret: "58jvHlaN2bWq3672Vygw9fFWlYc",
// });

const cloudinaryUploadImg = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return {
      url: data?.secure_url,
    };
  } catch (error) {
    return error;
  }
};

module.exports = cloudinaryUploadImg;
