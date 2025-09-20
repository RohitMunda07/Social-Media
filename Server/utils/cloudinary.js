import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (localPath) => {
    try {
        if (!localPath) return null;
        console.log("local file checked");
        const response = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto"
        })
        console.log("check after upload");
        console.log("File Uploaded: ", response?.url || "Error getting URL");
        // unlink files after upload to cloudinary
        fs.unlinkSync(localPath)
        console.log("File Unlinked Successfully");
        console.log("Cloudinary Response: ", response);

        return response

    } catch (error) {
        console.error("Cloudinary upload error: ", error);
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
        return null;
    }

}

export {
    uploadOnCloudinary
}