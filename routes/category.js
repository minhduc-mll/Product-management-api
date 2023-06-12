const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");
const multer = require("../middlewares/Multer");
const { cloudinaryUpload } = require("../middlewares/CloudinaryUpload");

router.get("/", CategoryController.getAllCategory);
router.get("/:id", CategoryController.getCategory);

router.post(
    "/",
    multer.single("image"),
    cloudinaryUpload,
    CategoryController.createCategory
);

router.put(
    "/:id",
    multer.single("image"),
    cloudinaryUpload,
    CategoryController.updateCategory
);
router.patch(
    "/:id",
    multer.single("image"),
    cloudinaryUpload,
    CategoryController.updateCategory
);
router.delete("/:id", CategoryController.deleteCategory);

module.exports = router;
