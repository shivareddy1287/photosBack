const expressAsyncHandler = require("express-async-handler");
const fs = require("fs");

const User = require("../../model/user/User");
const generateToken = require("../../config/token/generateToken");
const Photo = require("../../model/photos/photos");
const cloudinaryUploadImg = require("../../utils/cloudinary");

//----------------------------------------------------------------
//Upload Photo
//----------------------------------------------------------------
// const uploadPhotosCtrl = expressAsyncHandler(async (req, res) => {
//   // console.log(req.body);

//   req.files.map(async (file) => {
//     console.log(file); // Check what file object contains

//     // 1. Get the path to img
//     const localPath = `public/images/photos/${file.filename}`;
//     console.log(localPath);

//     //2.Upload to cloudinary
//     const imgUploaded = await cloudinaryUploadImg(localPath);

//     const post = await Photo.create({
//       leaderId: req.body.userId,
//       date: req.body.date,
//       image: file.buffer.toString("base64"),
//     });
//   });

//   res.status(201).json({ message: "Photos uploaded successfully" });
// });

const uploadPhotosCtrl = expressAsyncHandler(async (req, res) => {
  try {
    // Check if req.body contains userId and date
    console.log("filesss", req.files);

    // Process all files with Promise.all to wait for uploads to complete
    const uploadedPhotos = await Promise.all(
      req.files.map(async (file) => {
        console.log(file); // Check what file object contains

        // 1. Get the path to img

        const localPath = `public/images/photos/${file.filename}`;
        console.log(localPath);

        // 2. Upload to cloudinary
        const imgUploaded = await cloudinaryUploadImg(localPath);
        console.log("Uploaded image to Cloudinary:", imgUploaded);

        // 3. Create a photo document in MongoDB
        const post = await Photo.create({
          leaderId: req.body?.leaderId, // Ensure this is correctly sent from the client
          date: req.body.date, // Ensure this is correctly sent from the client
          image: imgUploaded.url, // Use the Cloudinary image URL instead of base64
        });

        fs.unlinkSync(localPath);

        return post;
      })
    );

    res.status(201).json({
      message: "Photos uploaded successfully",
      photos: uploadedPhotos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading photos", error });
  }
});

//-------------------------------
//Fetch al photos
//-------------------------------
const fetchPhotosCtrl = expressAsyncHandler(async (req, res) => {
  console.log("ss");

  try {
    const photos = await Photo.find({});
    res.json(photos);
  } catch (error) {
    res.json(error);
  }
});

//------------------------------
//Delete Post
//------------------------------

const deletePhotosCtrl = expressAsyncHandler(async (req, res) => {
  const { ids } = req.query; // Extract the photo IDs from the query parameters
  console.log("ids", ids);

  if (!ids) {
    return res.status(400).json({ message: "No photo IDs provided" });
  }

  const photoIds = ids.split(","); // Convert the comma-separated string into an array

  try {
    const deletedPhotos = await Photo.deleteMany({ _id: { $in: photoIds } }); // Delete photos by IDs
    res.json(deletedPhotos);
  } catch (error) {
    res.status(500).json(error);
  }
});

// module.exports = { uploadPhotosCtrl, fetchPhotosCtrl,  };

module.exports = {
  uploadPhotosCtrl,
  fetchPhotosCtrl,
  deletePhotosCtrl,
};
