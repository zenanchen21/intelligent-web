var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var eventSchema = new Schema(
    {
        title: {type: String, required: true},
        address:{type: String, required:true},
        location: {
            lat:{type: Number},
            lon:{type:Number},
        },
        description: {type: String},
        date:{type: Date},
        author: {type: Schema.Types.ObjectId, ref: 'User'},
        posts: [{type:Schema.Types.ObjectId, ref: 'Post'}]
    }
);


// User.set('toObjet', {getters: true, virtuals: true});
eventSchema.set('toObject', {getters: true, virtuals: true});

var event = mongoose.model('Event', eventSchema );

module.exports = event;