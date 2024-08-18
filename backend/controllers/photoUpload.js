import { connection } from "../index.js";
import multer from "multer";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve("config/serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "movie-mingle-2ec48.appspot.com",
});
const bucket = admin.storage().bucket();
const storage = multer.memoryStorage();

export const photoUpload = async (req, res, next) => {
  try {
    const files = req.files;
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).send("No files uploaded.");
    }

    const uploadPromises = Object.keys(files).map(async (key) => {
      const file = files[key][0];
      const uniqueFileName = `${uuidv4()}-${file.originalname}`;

      const fileUpload = bucket.file(uniqueFileName);
      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
        public: true,
      });

      const [downloadURL] = await fileUpload.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });

      return { [key]: downloadURL };
    });

    const downloadURLs = await Promise.all(uploadPromises);
    res.json(downloadURLs);
  } catch (error) {
    console.error("Error uploading photos:", error);
    next(error);
  }
};
