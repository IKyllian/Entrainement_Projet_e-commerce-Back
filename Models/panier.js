var mongoose = require('mongoose');

var panierSchema = mongoose.Schema({
    products : [{type: mongoose.Schema.Types.ObjectId, ref: 'products'}],
    productsQuantity : [Number],
})

module.exports = mongoose.model('paniers', panierSchema);
