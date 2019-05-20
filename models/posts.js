var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var postSchema = new Schema(
    {
        content: {type: String, required: true, min:3},
        img: [{data: Buffer, contentType: String}],
        date:{type: Date, required:true},
        address: {type: String},
        location: {
            lat: {type: Number},
            lng: {type: Number},
        },
        comment: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
        author: {type: Schema.Types.ObjectId, ref: 'User'},
        event: {type: Schema.Types.ObjectId, ref: 'Event'}
    }
);




// User.set('toObjet', {getters: true, virtuals: true});
postSchema.set('toObject', {getters: true, virtuals: true});

var post = mongoose.model('Post', postSchema );

module.exports = post;