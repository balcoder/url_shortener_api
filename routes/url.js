var express = require('express');
var router = express.Router();
var dns = require('dns');
//var async = require('async')

// Require controller modules
var url_controller = require('../controllers/urlController')

// var validateDns = (req, res, next) =>  {
//   console.log(req.body.url);
//   dns.lookup(req.body.url, function(err, address, family) {
//     console.log(err);
//     if(err !== null) {
//       // we don't  have a valid url
//       res.json({"error":"invalid URL"});
//       return;
//     } else {
//        next();
//     }
//   });
// };
//
//
// router.use('/', validateDns)

// use a regex to check if url is valid
router.use('/', function(req, res, next) {
// check for a valid url
  var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
  if(!urlPattern.test(req.body.url)) {
     res.json({"error":"invalid URL"});
  } else {
   next();
  }
});

router.post('/', url_controller.url_shorten);


//Export router
module.exports = router;
