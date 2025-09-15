import fs from "fs";
import path from "path";

export const uploadFile = async (file) => {
  const uploadDir = path.join(process.cwd(), "uploads");

  // ถ้าโฟลเดอร์ยังไม่มี ให้สร้าง
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, file.originalname);

  // ย้ายไฟล์จาก buffer ไปเก็บ
  fs.writeFileSync(filePath, file.buffer);

  return {
    url: `/uploads/${file.originalname}`,
    filePath,
  };
};
