import multer from "multer";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),  
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
  }),
  storageBucket: "movie-mingle-2ec48.appspot.com"
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
