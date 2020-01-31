var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    name : String,
    description : String,
    price : Number,
    note : Number,
    images : [String],
    commentaires : [{type: mongoose.Schema.Types.ObjectId, ref: 'commentaires'}],
    stock : Number,
    type : String
})

module.exports = mongoose.model('products', productSchema);