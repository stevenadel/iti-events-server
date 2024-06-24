import { UploadApiResponse } from "cloudinary";
import cloudinary from "../configs/cloudinaryConfig";

export const deleteImageFromCloud = (publicId: string): Promise<boolean> => new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId).then((result) => {
        console.log(`Delete successfully image with publicId [${publicId}]`);
        resolve(true);
    }).catch((err) => {
        console.log(`Couldn't destroy image with publicId [${publicId}]`);
        resolve(false);
    });
});

export const uploadImageToCloud = (fileBuffer: Buffer, folder: string = "uploads"): Promise<UploadApiResponse> => new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
        if (err) {
            console.log(`Could not upload image due to : ${err.message}`);
            return reject(err);
        }
        if (!result) {
            return reject(new Error("Cloudinary upload failed with result undefined"));
        }
        console.log(`Uploaded image successfully with url [${result.secure_url}]`);
        resolve(result);
    });
    stream.end(fileBuffer);
});
