const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const { verifyByCookies } = require("../middlewares/AuthHandler");
const {
    cloudinaryUpload,
    cloudinaryGenerate,
    cloudinaryRename,
    cloudinaryDestroy,
} = require("../middlewares/CloudinaryUpload");
const multer = require("../middlewares/Multer");

router.get("/", verifyByCookies);

router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.post("/logout", AuthController.logout);

router.put(
    "/:id",
    verifyByCookies,
    multer.single("image"),
    cloudinaryUpload,
    AuthController.updateProfile
);

router.post("/change_password", verifyByCookies, AuthController.changePassword);

router.get("/cloudinary/generate", cloudinaryGenerate);
router.post("/cloudinary/upload", multer.single("image"), cloudinaryUpload);
router.put("/cloudinary/rename", cloudinaryRename);
router.delete("/cloudinary/destroy", cloudinaryDestroy);

module.exports = router;
