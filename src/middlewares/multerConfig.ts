// multerConfig.ts
import multer from 'multer';

// Define storage configuration for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Specify the destination directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
    }
});

// Initialize multer with the storage configuration
export const upload = multer({ storage });
