var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var searchSchema = new Schema({
  searchVal: String,
}, {timestamps: true})

var ModelClass = mongoose.model('searchTerm', searchSchema);

module.exports = ModelClass;
