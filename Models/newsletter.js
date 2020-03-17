var mongoose = require('mongoose');

var newsletteSchema = mongoose.Schema({
    email: String,
    date_insert: Date,
})

module.exports = mongoose.model('newsletter_emails', newsletteSchema);