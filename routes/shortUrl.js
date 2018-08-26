var express = require('express');
var router = express.Router();

// Require controller modules
var url_controller = require('../controllers/urlController')
router.get('/:shortUrl', url_controller.url_lengthen)

//Export router
module.exports = router;
