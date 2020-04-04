var mongoose = require('mongoose');

var promoCodeSchema = mongoose.Schema({
    code: String,
    discount_price: Number,
    creation_date: Date
})

module.exports = mongoose.model('promoCode', promoCodeSchema);