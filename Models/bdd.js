var mdp = require('../config')
var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  
  mongoose.connect(`mongodb+srv://Kyllian:FXy2fhYs7VFcXSsc@cluster0-j2aoe.mongodb.net/test?retryWrites=true&w=majority`, 
    options,     
    function(err) {
     console.log(err);
    }
  );

  module.exports = mongoose;