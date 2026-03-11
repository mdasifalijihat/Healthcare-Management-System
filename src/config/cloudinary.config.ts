import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../app/errorHelpers/AppError";
import status from "http-status";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

// images deleted
export const deleteFileFromCloudinary = async (url: string) => {
  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|webp|gif|svg|pdf)/;

    const match = url.match(regex);

    if (match && match[1]) {
      const publicId = match[1];
      const extension = match[2];
      const resourceType = extension === "pdf" ? "raw" : "image";

      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });

      console.log(`file ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.error("Error deleting file from cloudinary:", error);

    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to delete file from cloudinary",
    );
  }
};

// upload file
export const uploadFileToCloudinary = (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse> => {
  if (!buffer || !fileName) {
    throw new AppError(
      status.BAD_REQUEST,
      "File buffer and file name are required for upload",
    );
  }

  const extension = fileName.split(".").pop()?.toLowerCase();

  const fileNameWithoutExtension = fileName
    .split(".")
    .slice(0, -1)
    .join(".")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const uniqueName =
    Math.random().toString(36).substring(2, 8) +
    "_" +
    Date.now() +
    "_" +
    fileNameWithoutExtension;

  const folder = extension === "pdf" ? "pdfs" : "images";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: `ph-healthcare/${folder}`,
        public_id: uniqueName,
      },
      (error, result) => {
        if (error) {
          return reject(
            new AppError(
              status.INTERNAL_SERVER_ERROR,
              "Failed to upload file to cloudinary",
            ),
          );
        }

        resolve(result as UploadApiResponse);
      },
    );

    stream.end(buffer);
  });
};

export const cloudinaryUpload = cloudinary;
