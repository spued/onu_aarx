var express = require('express');
var router = express.Router();
var manage = require('../controller/manage');

/* GET home page. */
router.get('/', manage.load_data);
router.post('/activate', manage.activate);
router.post('/deactivate', manage.deactivate);
router.post('/reactivate', manage.reactivate);
router.post('/search', manage.search);

module.exports = router;
