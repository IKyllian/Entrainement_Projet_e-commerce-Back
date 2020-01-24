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
   fullAddress : addressSchema,
   role : String,
   panier : [{type: mongoose.Schema.Types.ObjectId, ref: 'products'}],
   orders : [{type: mongoose.Schema.Types.ObjectId, ref: 'orders'}],
   ateliers : [{type: mongoose.Schema.Types.ObjectId, ref: 'ateliers'}],
})

module.exports = mongoose.model('users', userSchema);