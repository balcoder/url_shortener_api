// Require the model we will later need to update/create our data and exports
// a function for each url we need to handle
var UrlModel = require('../models/url');
var dns = require('dns');


// require validation and sanitization modules
var { body,validationResult } = require('express-validator/check');
var { sanitizeBody } = require('express-validator/filter');

var async = require('async');


function htmlEntityDecode(str) {
  var re = /&#x2F;/ig;
  return str.replace(re, '/');
}
// pass the router an array of middleware functions each called in order
exports.url_shorten =  [

    // Validate that the name field is not empty.
    body('url', 'URL required').isLength({ min: 1 }).trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('url').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        console.log('req.dnsInfo **************: ' + req.dnsInfo);
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Url object with escaped and trimmed data.
        var Url = new UrlModel(
          { url: req.body.url }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with error messages.
            res.render('index', { errors: errors.array()});
        return;
      }
       else {
        // Data from form is valid.
        // Check if Url with same name already exists.
        UrlModel.findOne({ 'url': req.body.url })
            .exec( function(err, found_url) {
                 if (err) { return next(err); }

                 if (found_url) {
                     // Url exists, respond with json.
                     res.json({original_url:htmlEntityDecode(found_url.url), shortened_url: found_url._id });
                 }
                 else {

                     Url.save(function (err) {
                       if (err) { return next(err); }
                       // Url saved. Find id and Respond with json.
                       UrlModel.findOne({ 'url': req.body.url })
                           .exec( function(err, found_url) {
                                if (err) { return next(err); }

                                if (found_url) {
                                    // Url exists, respond with json.
                                    res.json({original_url:htmlEntityDecode(found_url.url), shortened_url: found_url._id });
                                }
                            });

                     });

                 }

             });
        }
    }
];

exports.url_lengthen = function(req, res) {
  UrlModel.findOne({ '_id': req.params.shortUrl })
      .exec( function(err, found_url) {
           if (err) { return next(err); }

           if (found_url) {
               // Url exists, respond with json.
                 res.redirect(htmlEntityDecode(found_url.url));
           }

       });
}
