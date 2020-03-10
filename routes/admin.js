var express = require('express');
var router = express.Router();

var ProductModel = require('../Models/product');
var UserModel = require('../Models/user');
var OrderModel = require('../Models/order');

router.get('/getUsers', async function(req, res) {
   var users = await UserModel.find();

   res.json({response: users})
})

router.get('/getProducts', async function(req, res) {
    var products = await ProductModel.find();
 
    res.json({response: products})
})

router.get('/getOrders', async function(req, res) {
    await OrderModel.find().populate('user').exec(function(err, orders) {
        res.json({response: orders})
    });
 
})

router.get('/getOrder', async function(req, res) {
    await OrderModel.findOne({_id: req.query.id}).populate('products').populate('user').exec(function(err, order) {
        if(order) {
            res.json({response: order})
        }
    })
})

router.post('/addProduct', async function(req, res) {
    var addProduct = await new ProductModel({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price,
        note : 0,
        images : req.body.images,
        stock : req.body.stock,
        type : req.body.type,
        soldNumber : 0
    })
    await addProduct.save();
    await ProductModel.findOne({_id: addProduct._id}, function(err, product) {
        product ? res.json({result: true}) : res.json({result: false});
    })
})

router.get('/getProductAdmin', async function(req, res) {
    await ProductModel.findOne({_id: req.query.id}, function(err, product) {
        if(product) {
            res.json({result: product})
        }
    })
})

router.post('/editProduct', async function(req, res) {
    await ProductModel.updateOne({_id: req.body.id}, {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        type: req.body.type
    })
    
    await ProductModel.findOne({_id: req.body.id}, function(err, product) {
        if(product) {
            res.json({result: true, product: product})
        }
    })
})
module.exports = router;