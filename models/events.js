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
        time:{type: Date},
        comment: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
    }
);


// User.set('toObjet', {getters: true, virtuals: true});
eventSchema.set('toObject', {getters: true, virtuals: true});

var event = mongoose.model('Event', eventSchema );

module.exports = event;