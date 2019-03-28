var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
var UserSchema = new Schema(
    {
        unique_id: {type: Number},
        username: {type: String, required: true},
        email:    {type: String, Required:  'Email address cannot be left blank.',
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
            index: {unique: true, dropDups: true}

        },
        password: {type: String, required:[true, 'password can not left blank'],  min:6},
        whatever: {type: String} //any other field
    }
);

// Virtual for a character's age
// User.virtual('age')
//     .get(function () {
//         const currentDate = new Date().getFullYear();
//         const result= currentDate - this.dob;
//         return result;
//     });

// User.set('toObject', {getters: true, virtuals: true});


var user = mongoose.model('User', UserSchema );

module.exports = user;