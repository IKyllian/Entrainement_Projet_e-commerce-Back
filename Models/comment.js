var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    title: String,
    message: String,
    date: Date,
    user : {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    note : Number,
    images : [String]
})

module.exports = mongoose.model('comments', commentSchema);