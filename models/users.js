var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
var userSchema = new Schema(
    {
        unique_id: {type: Number},
        username: {type: String, required: true},
        email:    {type: String, Required:  'Email address cannot be left blank.',
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
            index: {unique: false, dropDups: true}

        },
        password: {type: String, required:[true, 'password can not left blank'],  min:6},
        event: [{type: Schema.Types.ObjectId, ref: 'Event'}],
        post:[{type: Schema.Types.ObjectId, ref: 'Post'}],
        preference: {
            firstname:{type:String},
            familyname:{type:String},
            jobtitle:{type:String},
            contactnumber: {type:Number}
        }
    }
);


// User.set('toObjet', {getters: true, virtuals: true});
userSchema.set('toObject', {getters: true, virtuals: true});

var user = mongoose.model('User', userSchema );

module.exports = user;