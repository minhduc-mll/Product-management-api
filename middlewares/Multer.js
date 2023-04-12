const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            const filename =
                "image_" + Date.now() + path.extname(file.originalname);
            cb(null, filename);
        },
        destination: (req, file, cb) => {
            const path = "./uploads";
            cb(null, path);
        },
    }),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            cb(new Error("Unsupported file type!"), false);
            return;
        }
        cb(null, true);
    },
});
