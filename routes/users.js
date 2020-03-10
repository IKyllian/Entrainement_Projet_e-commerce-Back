var express = require('express');
var router = express.Router();
var uid2 = require("uid2");
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");

var UserModel = require('../Models/user')
var PanierModel = require('../Models/panier')

router.post('/createAdminUser', async function(req, res) {
  var salt = uid2(32);
  var token = uid2(32);
  var password = '';
  var newAdmin = await new UserModel({
    first_name : '',
    last_name : '',
    email : '',
    salt : salt,
    password : SHA256(password + salt).toString(encBase64), //Hashé le mot de passe 
    token : token,
    role : 'admin',
  })
})


router.post('/signup', async function(req, res) {
    var checkUser = await UserModel.findOne({email: req.body.email}); //Check si l'email existe en bdd
    //Si il trouve email en bdd, email not valid
    if(checkUser) {
      console.log('Email already exist');
      res.json({validLog: false})
    } else {
      var salt = uid2(32);
      var token = uid2(32);
      var userPanier;
      var userProductsQuantity;
      if(req.cookies.cartNotConnected) {
        var panierCookie = await PanierModel.findOne({_id : req.cookies.cartNotConnected.panierId});
        if(panierCookie) {
          userPanier = panierCookie.products;
          userProductsQuantity = panierCookie.productsQuantity;
          await PanierModel.deleteOne({_id : req.cookies.cartNotConnected.panierId});
          res.clearCookie('cartNotConnected', {path:'/'});
        }
      } else {
        userPanier = undefined;
      }
      //Création du user dans la bdd
      var newUser = await new UserModel({
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        email : req.body.email,
        salt : salt,
        password : SHA256(req.body.password + salt).toString(encBase64), //Hashé le mot de passe 
        token : token,
        role : 'user',
        dateInsert : new Date(),
        panier : userPanier,
        productsQuantity : userProductsQuantity,
      })

      //Sauvegarde en bdd
      await newUser.save();

      if(req.body.stayConnected !== false) {
        res.cookie('userToken', token, {path:'/'}).status(200);
      } else {
        req.session.userToken = token;
      }

      //Renvoie les informations au front
      res.json({result: newUser, validLog: true});
    }
})

router.get('/signin', async function(req, res) {
  var checkUser = await UserModel.findOne({email: req.query.email}, async function(err, user) { //Check si l'email existe en bdd
    if(user) {
      //Verification du mot de passe hashé 
      var hash = SHA256(req.query.password + user.salt).toString(encBase64);
      if(hash === user.password) {
        //Permet de regarder si un panier a été crée avant la connexion
        if(req.cookies.cartNotConnected) {
          //Si oui, fusionne les deux paniers (panier dans avant connexion et panier du compte user)
          //Puis supprime le panier en bdd et le cookie
          var panierCookie = await PanierModel.findOne({_id : req.cookies.cartNotConnected.panierId});
          if(panierCookie) {
            var mergeArrays = user.panier.concat(panierCookie.products);
            var mergeProductsQuantity = user.productsQuantity.concat(panierCookie.productsQuantity);
            user.panier = mergeArrays;
            user.productsQuantity = mergeProductsQuantity;
            user.save();
          }
          await PanierModel.deleteOne({_id : req.cookies.cartNotConnected.panierId})
          res.clearCookie('cartNotConnected', {path:'/'});
          //Permet de savoir si le user veut rester connecter ou non
          if(req.query.stayConnected !== false) {
            res.cookie('userToken', user.token, {path:'/'}).status(200);
          } else {
            req.session.userToken = user.token;
          }
          res.json({userExist: true, user: user})
        } else {
          //Permet de savoir si le user veut rester connecter ou non
          if(req.query.stayConnected !== false) {
            res.cookie('userToken', user.token, {path:'/'}).status(200);
          } else {
            req.session.userToken = user.token;
          }
          res.json({userExist: true, user: user})
        }
      } else {
        res.json({userExist: false,  inputError: 'password'})
      }
    }
  }); 
  //Si l'email existe pas, Log incorrect
  if(!checkUser) {
    console.log('User not exist');
    res.json({userExist: false, inputError: 'email'})
  }
})

router.get('/checkUserConnected', async function(req, res) {
  var checkUser;
  if(req.cookies.userToken) {
    checkUser = await UserModel.findOne({token: req.cookies.userToken}).populate('panier');
  } else if(req.session.userToken) {
    checkUser = await UserModel.findOne({token: req.session.userToken}).populate('panier');
  }
  if(checkUser) {
    res.json({userConnected: true, user: checkUser});
  } else {
    if(req.cookies.cartNotConnected) {
      await PanierModel.findOne({_id: req.cookies.cartNotConnected.panierId}).populate('products').exec(function(err, panier) {
        if(panier) {
          res.json({userConnected: false, cartOnCookies : panier});
        }
      })
    } else {
      res.json({userConnected: false, cartOnCookies : undefined});
    }
  }
})

router.get('/logout', function(req, res) {
    req.session.userToken = null;
    res.clearCookie('userToken', {path:'/'}).send('Ok.');
})


module.exports = router;
