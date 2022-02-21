var express = require('express');
var router = express.Router();
var manage = require('../controller/manage');

/* GET home page. */
//router.get('/', manage.load_data);
router.get('/', function(req, res, next) {
  res.render('index', {title: "test"} );
})
router.get('/search', function(req, res, next) {
  res.render('search', {title: "Search by keyword"} );
})

module.exports = router;
