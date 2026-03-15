import axios from "axios";
import api from "@/config/axios";

interface UploadResponse {
  url: string;
  key: string;
}

export async function uploadFile(file: File) {

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  const fileDetails = {
    fileName: `${Date.now()}-${file.name}`,
    fileType: file.type
  };

  try {

    // 1️⃣ Get presigned URL
    const res = await api.post<UploadResponse>(
      "/api/resume/upload-url",
      fileDetails
    );

    const { url, key } = res.data;

    // 2️⃣ Upload to S3
    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type
      }
    });

    return {
      key,
      fileName: fileDetails.fileName
    };

  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}