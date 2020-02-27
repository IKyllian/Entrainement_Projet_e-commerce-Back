var mongoose = require('mongoose');

var addressSchema = mongoose.Schema({
   address : String,
   city : String,
   zipCode : Number
})

var userSchema = mongoose.Schema({
   first_name : String,
   last_name : String,
   email : String,
   salt : String,
   password : String,
   token : String,
   homeAddress : addressSchema,
   secondaryAddress : addressSchema,
   role : String,
   panier : [{type: mongoose.Schema.Types.ObjectId, ref: 'products'}],
   productsQuantity : [Number],
   orders : [{type: mongoose.Schema.Types.ObjectId, ref: 'orders'}],
   ateliers : [{type: mongoose.Schema.Types.ObjectId, ref: 'ateliers'}],
   comments : [{type: mongoose.Schema.Types.ObjectId, ref: 'comments'}],
})

module.exports = mongoose.model('users', userSchema);