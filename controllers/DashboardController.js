const read = async (req, res) => {
    return res.status(200).json("HGTP API");
};

module.exports = {
    read,
};
