var express = require('express');
var router = express.Router();
var uid2 = require("uid2");
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");

var UserModel = require('../Models/user');
var PanierModel = require('../Models/panier');

const arrayBackground = [
  '#f56a00',
  '#7265e6',
  '#ffbf00',
  '#00a2ae',
  '#22e8e8',
  '#3d79d3',
  '#d639a7'
];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

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
      //Check si un panier existe dans les cookies
      if(req.cookies.cartNotConnected) {
        //Si oui, stock le panier dans la variable userPanier.
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
      var newFirstName = req.body.first_name.charAt(0).toUpperCase() + req.body.first_name.slice(1)
      var newLastName = req.body.last_name.charAt(0).toUpperCase() + req.body.last_name.slice(1)
      //Création du user dans la bdd
      var newUser = await new UserModel({
        first_name : newFirstName,
        last_name : newLastName,
        email : req.body.email,
        salt : salt,
        password : SHA256(req.body.password + salt).toString(encBase64), //Hashé le mot de passe 
        token : token,
        role : 'user',
        dateInsert : new Date(),
        panier : userPanier,
        productsQuantity : userProductsQuantity,
        background_profil: arrayBackground[getRandomInt(arrayBackground.length - 1)],
        sold_points: 0,
        discount_codes: [],
      })

      //Sauvegarde en bdd
      await newUser.save(err => {
        if(err) {
          res.json({result: false, validLog: true});
        } else {
          if(req.body.stayConnected !== false) {
            res.cookie('userToken', token, {path:'/', expires : new Date(Date.now() + 2592000000)}).status(200);
          } else {
            req.session.userToken = token;
          }
          res.json({result: true, validLog: true});
        }
      }); 
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
            var removeValFromIndex = []
            //Check si des produits sont en double dans les deux paniers, et stock leur index dans removeValFromIndex
            for(var i = 0; i < panierCookie.products.length; i++) {
              for(var j = 0; j < user.panier.length; j++) {
                if(`${panierCookie.products[i]}` == user.panier[j]) {
                  removeValFromIndex.push(i)
                  await UserModel.updateOne({email: req.query.email}, { $set : { [`productsQuantity.${j}`]: user.productsQuantity[j] + panierCookie.productsQuantity[i]}});
                }
              }
            }
            //Supprime les produits en double dans le panier des cookies
            if(removeValFromIndex.length > 0) {
              for(var i = removeValFromIndex.length - 1; i >= 0; i--) {
                panierCookie.products.splice(removeValFromIndex[i], 1);
                panierCookie.productsQuantity.splice(removeValFromIndex[i], 1)
              }
            }
            
            var mergeArrays = user.panier.concat(panierCookie.products);
            var mergeProductsQuantity = user.productsQuantity.concat(panierCookie.productsQuantity);
            user.panier = mergeArrays;
            user.productsQuantity = mergeProductsQuantity;
            user.save();
          }
          await PanierModel.deleteOne({_id : req.cookies.cartNotConnected.panierId})
          res.clearCookie('cartNotConnected', {path:'/'});
        }
        //Permet de savoir si le user veut rester connecter ou non
        if(req.query.stayConnected === 'false') {
          req.session.userToken = user.token;
        } else {
          res.cookie('userToken', user.token, {path:'/', expires : new Date(Date.now() + 2592000000)}).status(200);;
        }
        res.json({userExist: true, user: user})
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
  //Check si un token est enregistrer dans les cookies ou dans la session
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
          res.json({userConnected: false, cartOnCookies : panier})
          ;
        } else {
          res.json({userConnected: false, cartOnCookies : undefined})
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
