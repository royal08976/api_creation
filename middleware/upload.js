const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save images in 'uploads' folder
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedTypes.includes(file.mimetype) || ![".jpeg", ".jpg", ".png"].includes(ext)) {
        return cb(new Error("Invalid file type. Only JPEG, JPG, and PNG are allowed"), false);
    }
    cb(null, true);
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

module.exports = upload;
