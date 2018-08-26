var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;
var connection = mongoose.createConnection('mongodb://admin:shortensquid101@ds125472.mlab.com:25472/shorten-url', {useNewUrlParser: true});

autoIncrement.initialize(connection);


var UrlSchema = new Schema({
  url : {type: String, required: true}
})

UrlSchema.plugin(autoIncrement.plugin, 'Url');


// Export model
module.exports = connection.model('Url', UrlSchema);
