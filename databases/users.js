var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcryptjs');

//The URL which will be queried. Run "mongod.exe" for this to connect
//var url = 'mongodb://localhost:27017/test';
var mongoDB = 'mongodb://localhost:27017/users';

mongoose.Promise = global.Promise;
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;

//check connection
db.once('open',function(){
    console.log('connected to mongoDB')
});

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.dropDatabase();



