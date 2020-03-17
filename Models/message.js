var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    name: String,
    email: String,
    title: String,
    message: String,
    date_send: Date,
    message_is_read: Boolean
})

module.exports = mongoose.model('messages', messageSchema);