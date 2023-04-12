const cloudinary = require("cloudinary").v2;

const BASE_FOLDER = "hgtp/";
const UPLOAD_PRESET = "hgtp_users";
const Folder = "users";

const generatePublicId = (public_id, folder) => {
    public_id = folder ? folder + "/" + public_id : public_id;
    return public_id;
};

const cloudinaryGenerate = (req, res) => {
    const url = cloudinary.url(
        BASE_FOLDER + generatePublicId(req.body.public_id, Folder)
    );
    return res.status(200).json(url);
};

const cloudinaryUpload = async (req, res, next) => {
    try {
        if (req.file) {
            const data = await cloudinary.uploader.unsigned_upload(
                req.file.path,
                UPLOAD_PRESET
            );

            if (data.existing) {
                return res
                    .status(200)
                    .json({ message: "File exists", url: data.secure_url });
            }
            req.image = data.secure_url;
            console.log("image: " + req.image);
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const cloudinaryRename = async (req, res) => {
    try {
        const data = await cloudinary.uploader.rename(
            BASE_FOLDER + generatePublicId(req.body.from_public_id, Folder),
            BASE_FOLDER + generatePublicId(req.body.to_public_id, Folder)
        );
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const cloudinaryDestroy = async (req, res) => {
    try {
        const data = await cloudinary.uploader.destroy(
            BASE_FOLDER + generatePublicId(req.body.public_id, Folder)
        );
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    cloudinaryGenerate,
    cloudinaryUpload,
    cloudinaryRename,
    cloudinaryDestroy,
};
