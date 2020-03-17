var mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    user : {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    products : [{type: mongoose.Schema.Types.ObjectId, ref: 'products'}],
    productsQuantity : [Number],
    cost : Number,
    delivery_name: String,
    delivery_address : String,
    delivery_additional_address: String,
    delivery_city : String,
    delivery_zipCode : Number,
    date_insert : Date,
    status: String
})

module.exports = mongoose.model('orders', orderSchema);