const multer = require('multer');
const path = require('path');
const PHOTODIRECTORY = "./public/photos/";

/*------------------------multer---------------------------*/
const storage = multer.diskStorage({
  destination: PHOTODIRECTORY,
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

module.exports = upload;
