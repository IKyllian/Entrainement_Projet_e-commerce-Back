var express = require('express');
var router = express.Router();
var uid2 = require("uid2");
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");

var UserSchema = require('../Models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', async function(req, res) {
    var checkUser = await UserSchema.findOne({email: req.body.email}); //Check si l'email existe en bdd
    console.log(checkUser)
    //Si il trouve email en bdd, email not valid
    if(checkUser) {
      console.log('Email already exist');
      res.json({validLog: false})
    } else {
      var salt = uid2(32);
      var token = uid2(32);
      //Création du user dans la bdd
      var newUser = await new UserSchema({
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        email : req.body.email,
        salt : salt,
        password : SHA256(req.body.password + salt).toString(encBase64), //Hashé le mot de passe 
        token : token,
        role : 'user',
      })

      //Sauvegarde en bdd
      await newUser.save();

      res.cookie('userToken', token, {path:'/'});

      //Renvoie les informations au front
      res.json({result: newUser, validLog: true});
    }
})

router.get('/signin', async function(req, res) {
  var checkUser = await UserSchema.findOne({email: req.query.email}, function(err, user) { //Check si l'email existe en bdd
    if(user) {
      //Verification du mot de passe hashé 
      var hash = SHA256(req.query.password + user.salt).toString(encBase64);
      if(hash === user.password) {
        //Renvoie les infos au front
        res.json({userExist: true, userDatas: user})
      } else {
        res.json({userExist: false})
      }
    }
  }); 
  //Si l'email existe pas, Log incorrect
  if(!checkUser) {
    console.log('User not exist');
    res.json({userExist: false})
  }
})

router.get('/checkUserConnected', async function(req, res) {
  var checkUser = await UserSchema.findOne({token: req.cookies.userToken});
  if(checkUser) {
    res.json({userConnected: true, user: checkUser});
  } else {
    res.json({userConnected: false});
  }
})

router.get('/logout', function(req, res) {
  res.clearCookie('userToken');
  //res.json({cookie: req.cookie.userToken})
})

module.exports = router;
