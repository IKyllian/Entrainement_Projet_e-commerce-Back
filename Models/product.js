var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    name : String,
    description : String,
    price : Number,
    note : Number,
    images : [String],
    comments : [{type: mongoose.Schema.Types.ObjectId, ref: 'comments'}],
    stock : Number,
    type : String
})

module.exports = mongoose.model('products', productSchema);
