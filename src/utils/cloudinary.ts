import cloudinary from "../configs/cloudinaryConfig";

const deleteFromCloudinary = async (publicId: string): Promise<void> => (
    new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    })
);

export default deleteFromCloudinary;
