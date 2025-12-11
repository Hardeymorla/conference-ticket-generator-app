import axios from "axios";

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const res = await axios.post(url, formData);

  console.log("Cloudinary response:", res.data);

  return res.data.secure_url; // ⭐ ONLY RETURN THE URL
};
