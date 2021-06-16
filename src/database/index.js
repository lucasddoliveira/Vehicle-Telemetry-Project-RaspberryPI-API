const mongoose = require('mongoose');

const mongoClient = require("mongodb").MongoClient;
mongoClient.connect("mongodb://localhost/apidata", { useNewUrlParser:true})
mongoose.Promise = global.Promise;

module.exports = mongoose;