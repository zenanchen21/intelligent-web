var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var commentSchema = new Schema(
    {
        author: {type: Schema.Types.ObjectId, ref: 'User'},
        content: {type: String, required: true, min:3},
        date:{type: Date, required:true}
    }
);




// User.set('toObjet', {getters: true, virtuals: true});
commentSchema.set('toObject', {getters: true, virtuals: true});

var comment = mongoose.model('Comment', commentSchema );

module.exports = comment;