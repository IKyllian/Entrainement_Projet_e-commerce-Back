var mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    user : {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    products : [{type: mongoose.Schema.Types.ObjectId, ref: 'products'}],
    cost : Number,
    delivery_address : String,
    delivery_city : String,
    delivery_zipCode : Number,
    date_insert : Date,
})

module.exports = mongoose.model('orders', orderSchema);