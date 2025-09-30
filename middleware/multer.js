const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
        const ext = file.mimetype.split('/')[1];
        cb(null,`IMG_${uniqueSuffix}.${ext}`);
    }
});
const filefilter = (req, file, cb) => {
    if (file.mimetype.startsWith('images/')) {
        cb(null, true);
    }else {
        throw new Error('Invalid file format: Imagine only');
    }
};

const limits = {
    fileSize: 1024 *1024 * 10
};
const uploads = multer({ 
    storage, 
    filefilter, 
    limits });

module.exports = uploads;