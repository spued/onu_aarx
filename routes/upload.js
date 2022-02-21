var express = require('express');
var router = express.Router();
const multer = require('multer');
var import_csv = require('../controller/import_csv');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, 'file-' + Date.now() + '.' +
        file.originalname.split('.')[file.originalname.split('.').length-1])}
})

const upload = multer({ storage: storage })

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('upload', { title: 'Upload' });
});

router.post('/', upload.single('fileupload'), import_csv.load_csv)

module.exports = router;
