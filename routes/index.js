var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');

var ProductModel = require('../Models/product');
var UserModel = require('../Models/user');
var OrderModel = require('../Models/order');
var CommentModel = require('../Models/comment');
var PanierModel = require('../Models/panier');

var stripeKeys = {
  public: "pk_test_n9MNHSqODl25K5GFwfLxbZC5007vhFerIx",
  private: "sk_test_96yYEPoMnj2A5bX1bekdmO5o00bxbBY8t8"
};

var stripe = require("stripe")(stripeKeys.private);


cloudinary.config({
  cloud_name:'df7gmexsk',
  api_key: 546224285817771,
  api_secret:'RCQbomAFlDXCqiHiqlU1wueF3b8'
});

async function getTotalNoteAvis(id) {
  await ProductModel.findOne({_id: id}).populate('comments').exec(function(err, product) {
    if(product) {
      console.log('product',product)
      
      console.log('total', total);
      return total;
    }
  })
}

const catalogueProducts = [
  // {
  //   name : 'Faber-Castell 110088 Set de crayons de couleur Art & Graphic',
  //   description : 'Pour l\'artiste, ils sont un outil de travail représentatif, pour l\'esthète un objet de design décoratif : les coffrets élégants en bois teinté couleur wengé. L\'assortiment de base et les accessoires assortis se prêtent à chaque créatif comme outil de travail prestigieux. Un assortiment de base de crayons de couleur pour artistes et de pastels Polychromos, de crayons de couleur aquarellables Albrecht Dürer ainsi qu\'un petit assortiment de PITT Monochrome se présente sur deux niveaux',
  //   prix: 160,
  //   note: 0,
  //   stock : 7,
  //   images : ['https://images.fr.shopping.rakuten.com/photo/Faber-Castell-Set-Crayons-Couleur-1035921657_L.jpg'],
  //   type : 'crayons de couleur',
  //   soldNumber :0
  // },
  // {
  //   name : 'Pochette feutres Pitt artist Pen Noir - Faber-Castell',
  //   description : 'La gamme PITT artist pen « Brush » se décline en 60 couleurs : les couleurs claires offrent la possibilité de jouer avec les transparences, tandis que les couleurs sombres ont un pouvoir couvrant plus marqué. La pointe « pinceau B » de grande qualité permet une application douce de l’encre sur le papier. La largeur des traits varie selon l’angle et la pression exercée sur le feutre. Même une fois repliée, la pointe reste parfaitement opérationnelle et ne rompt pas. Une fois sèche, l’encre devient permanente et peut être combinée avec des crayons aquarellables.',
  //   prix: 15,
  //   note: 0,
  //   stock : 10,
  //   images : ['https://www.dalbe.fr/4184-large_default/pochette-feutres-pitt-artist-pen-noir-faber-castell.jpg'],
  //   type : 'feutre',
  //   soldNumber :0
  // },
  // {
  //   name : 'Set de 12 + 1 Promarker',
  //   description : 'Pour l\'artiste, ils sont un outil de travail représentatif, pour l\'esthète un objet de design décoratif : les coffrets élégants en bois teinté couleur wengé. L\'assortiment de base et les accessoires assortis se prêtent à chaque créatif comme outil de travail prestigieux. Un assortiment de base de crayons de couleur pour artistes et de pastels Polychromos, de crayons de couleur aquarellables Albrecht Dürer ainsi qu\'un petit assortiment de PITT Monochrome se présente sur deux niveaux',
  //   prix: 160,
  //   note: 0,
  //   stock : 7,
  //   images : ['https://images-eu.ssl-images-amazon.com/images/I/51WXjhWDSVL._SL500_AC_SS350_.jpg'],
  //   type : 'marqueur',
  //   soldNumber :0
  // },
  // {
  //   name : 'Canson - Pochette de 12 feuilles de papier dessin CA GRAIN 180g - 24x32cm',
  //   description : 'La pochette Canson "C" à grain propose un papier dessin blanc grain fin unique. Déclinée en 3 grammages, ce papier est idéal pour le dessin réalisé au crayon de papier, crayon de couleur ou feutre mais également pour le travail à l\'encre ou à la gouache. ',
  //   prix: '6',
  //   note: '0',
  //   stock : '15',
  //   images : ['https://fr.canson.com/sites/default/files/pochette-cagrain-1.jpg'],
  //   type : 'papier',
  //   soldNumber :0
  // },
  // {
  //   name : 'Papier peinture blanc naturel, 370g/m² en 24x32cm - Pochette de 6 feuille',
  //   description : 'Pochette 6 feuilles dessins blanc naturel, 370g/m² en 24x32cm Grain léger, ne gondole pas, idéal pour la peinture (gouache, acrylique, aquarelle, encre) ',
  //   prix: '5',
  //   note: '0',
  //   stock : '0',
  //   images : ['https://www.lacentraledubureau.com/images/products/30896.jpg'],
  //   type : 'papier',
  //   soldNumber :0
  // },
  // {
  //   name : 'Boîte métal 12 crayons graphite CASTELL 9000 DESIGN',
  //   description : 'Boîte métal 12 crayons graphite CASTELL 900012 duretés de mine: 2B,3B,4B,B,HB,F,H,2H,3H,4H,5H,6HDes crayons de qualité exceptionnelle, la mine est produite à partir des meilleurs graphites et argiles, collée (procédé de résistance SV), vernis écologique à l’eau, cèdre rose de Californie.Code EAN sur chaque crayon.',
  //   prix: '15',
  //   note: '0',
  //   stock : '7',
  //   images: ['https://www.rougier-ple.fr/phproduct20140204/P_74950_P_1_PRODUIT.jpg'],
  //   type : 'crayons à papier',
  //   soldNumber : 0
  // },
  {
    name : 'Boîte métal 12 crayons graphite CASTELL 9000 DESIGN',
    description : 'Boîte métal 12 crayons graphite CASTELL 900012 duretés de mine: 2B,3B,4B,B,HB,F,H,2H,3H,4H,5H,6HDes crayons de qualité exceptionnelle, la mine est produite à partir des meilleurs graphites et argiles, collée (procédé de résistance SV), vernis écologique à l’eau, cèdre rose de Californie.Code EAN sur chaque crayon.',
    prix: '15',
    note: '0',
    stock : '7',
    images: ['https://www.rougier-ple.fr/phproduct20140204/P_74950_P_1_PRODUIT.jpg'],
    type : 'crayons de couleur',
    soldNumber : 0
  }
]

/* GET home page. */
router.get('/getProductsHome', async function(req, res) {
  var products = await ProductModel.find()
  res.json({result: products})
});

//Route qui permet d'inserer des produits en bdd
router.post('/addProducts', async function(req, res, next) {
  for(var i = 0; i < catalogueProducts.length; i++) {
    var newProduct = await new ProductModel({
      name : catalogueProducts[i].name,
      description : catalogueProducts[i].description,
      price : catalogueProducts[i].prix,
      note : catalogueProducts[i].note,
      images : catalogueProducts[i].images,
      stock : catalogueProducts[i].stock,
      type : catalogueProducts[i].type,
      soldNumber : catalogueProducts[i].soldNumber
    })

    await newProduct.save();
  }
  res.json({result : true})
})

router.get('/getProducts', async function(req, res) {
  var getProducts = await ProductModel.find(); //Va chercher tous les produits en bdd

  res.json({products : getProducts}) //Renvoie les infos au front
})

router.get('/product', async function(req, res) {
  //Permet d'aller recuperer un produit grace a son id, que l'on recupere depuis le front
  //Nested Populate, permet d'aller recuperer les infortion sur user en passant par le model de commentaires
  await ProductModel.findById({_id: req.query.id}).populate({path: 'comments', populate: { path: 'user', model : UserModel}}).exec(async function(err, product) {
    if(product) {
      var allProducts = await ProductModel.find();
      res.json({result : product, allProducts: allProducts}) //Renvoie les infos au front
    }
  }) 
 })

router.post('/addProduct', async function(req, res) {
  console.log('Execute')
    await UserModel.findOne({token: req.body.userToken}, async function(err, user) {
      if(user) {
        var productAlreadyExist = false;
        var indexOfProduct;
        for(var i = 0; i < user.panier.length; i++) {
          if(user.panier[i] == req.body.idProduct) {
            productAlreadyExist = true;
            indexOfProduct = i;
            break;
          }
        }

        if(productAlreadyExist) {
          var currentQuantity = user.productsQuantity[indexOfProduct]
          await UserModel.updateOne({_id: user._id}, { $set : { [`productsQuantity.${indexOfProduct}`]: currentQuantity + 1 }});
          res.json({productExist: true, indexProduct: indexOfProduct});
        } else {
          user.panier.push(req.body.idProduct);
          user.productsQuantity.push(1);
          user.save();
          res.json({productExist: false})
        }
      }
    })
})

router.get('/addProductCookie', async function(req, res) {
  await ProductModel.findOne({_id: req.query.idProduct}, async function(err, product) {
    if(product) {
      if(!req.cookies.cartNotConnected) {
        var newPanier = await new PanierModel({
          products: req.query.idProduct,
          productsQuantity: [1]
        })
        await newPanier.save()
        res.cookie('cartNotConnected', {panierId: newPanier._id},
          {path:'/'}).send('Ok.');
      } else {
        await PanierModel.findOne({_id: req.cookies.cartNotConnected.panierId}, async function(err, panier){
          if(panier) {
            var productAlreadyExist = false;
            var indexOfProduct;
            for(var i = 0; i < panier.products.length; i++) {
              if(panier.products[i] == req.query.idProduct) {
                productAlreadyExist = true;
                indexOfProduct = i;
                break;
              }
            }

            if(productAlreadyExist) {
              var currentQuantity = panier.productsQuantity[indexOfProduct]
              await PanierModel.updateOne({_id: panier._id}, { $set : { [`productsQuantity.${indexOfProduct}`]: currentQuantity + 1 }});
              res.json({productExist: true, indexProduct: indexOfProduct});
            } else {
              panier.products.push(req.query.idProduct);
              panier.productsQuantity.push(1);
              panier.save();
              res.json({productExist: false})
            }
          }
        })
      }  
    }
  })
})

router.post('/changeProductQuantity', async function(req, res) {
  if(req.body.userToken == undefined) {
    if(req.cookies.cartNotConnected) {
      await PanierModel.updateOne({_id: req.cookies.cartNotConnected.panierId}, { $set : {[`productsQuantity.${req.body.index}`]: req.body.value }});
    }
  } else {
    await UserModel.updateOne({token: req.body.userToken}, { $set : {[`productsQuantity.${req.body.index}`]: req.body.value }});
  }
  res.json({result: true})
})

router.get('/dataHeaderPanier', async function(req, res) {
    await UserModel.findOne({token: req.query.userToken}).populate('panier').exec(async function(err, user) {
      if(user) {
        res.json({result: user})
      } else {
        if(req.cookies.cartNotConnected) {
          await PanierModel.findOne({_id : req.cookies.cartNotConnected.panierId}).populate('products').exec(function(err, panier){
            if(panier) {
              res.json({cookie: panier});   
            }
          })
        } else {
          res.json({response: false})
        }
      }
    });
})

router.get('/getUserPanier', async function(req, res) {
  await UserModel.findOne({token: req.query.userToken}).populate('panier').exec(async function(err, userDatas) {
    if(userDatas) {
      res.json({result: userDatas});
    } else if(req.cookies.cartNotConnected) {
      await PanierModel.findOne({_id : req.cookies.cartNotConnected.panierId}).populate('products').exec(function(err, panier){
        if(panier) {
          res.json({cookie: panier});   
        }
      })
    } else {
      res.json({response :false})
    }
  })
})

router.post('/deleteProduct', async function(req, res) {
    await UserModel.findOne({token: req.body.userToken}).populate('panier').exec(async function(err, user) {
      if(user) {
        if(user.productsQuantity[req.body.positionProduct] <= 1) {
          user.panier.splice(req.body.positionProduct, 1);
          user.productsQuantity.splice(req.body.positionProduct, 1);
          user.save()
          res.json({result : user, productDelete: true});
        } else {
          var currentQuantity = user.productsQuantity[req.body.positionProduct]
          await UserModel.updateOne({_id: user._id}, {$set : {[`productsQuantity.${req.body.positionProduct}`]: currentQuantity - 1 }});
          res.json({result : user, productDelete: false});
        }
      } else if(req.cookies.cartNotConnected) {
        await PanierModel.findOne({_id: req.cookies.cartNotConnected.panierId}).populate('products').exec(async function(err, panier) {
          if(panier) {
            if(panier.productsQuantity[req.body.positionProduct] <= 1) {
              panier.products.splice(req.body.positionProduct, 1);
              panier.productsQuantity.splice(req.body.positionProduct, 1);
              panier.save()
              res.json({resultCookie : panier, productDelete: true});
            } else {
              var currentQuantity = panier.productsQuantity[req.body.positionProduct]
              await PanierModel.updateOne({_id: panier._id}, {$set : {[`productsQuantity.${req.body.positionProduct}`]: currentQuantity - 1 }});
              res.json({resultCookie : panier, productDelete: false});
            }
          }
        })
      } else {
        res.json({response: false})
      }
    })
})

router.post('/addAddress', async function(req, res) {
    await UserModel.findOne({token: req.body.userToken}, function(err, user) {
      if(user) {
        var isHomeAddress;
        if(!user.homeAddress){
          isHomeAddress = true;
          user.homeAddress = {
            address : req.body.address,
            city : req.body.city,
            zipCode : req.body.zipCode
          }
        } else if(user.homeAddress || !user.secondaryAddress) {
          isHomeAddress = false;
          user.secondaryAddress = {
            address : req.body.address,
            city : req.body.city,
            zipCode : req.body.zipCode
          }
        }
          
         user.save()
         res.json({addHomeAddress : isHomeAddress,result: user})
      }
    })
})

router.post('/createOrderCart', function(req, res) {
  res.cookie('orderCart', { 
    products : req.body.products,
    productsQuantity: req.body.productsQuantity,
    totalProductsPrice: req.body.totalProductsPrice,
    totalDeliveryPrice: req.body.totalDeliveryPrice,
    totalOrder : req.body.totalOrder
  }, {expires : new Date(Date.now() + 24 * 3600000), path:'/'}).status(200).send('Ok.');

})

router.post('/createOrderAddress', function(req, res) {
  res.cookie('orderAddress', { 
    address : req.body.address,
    city: req.body.city,
    zipCode: req.body.zipCode,
  }, {expires : new Date(Date.now() + 24 * 3600000), path:'/'}).status(200).send('Ok.');
})


router.post('/orderConfirm', async function(req, res) {
  await UserModel.findOne({token : req.body.userToken}, async function(err, user) {
    if(user) {
      (async () => {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: req.body.totalOrder*100,
          currency: 'eur',
          description: `${user.first_name} ${user.last_name} | ${req.body.orderAddress} - ${req.body.orderCity} - ${req.body.orderZipCode}` ,
          // Verify your integration in this guide by including this parameter
          metadata: {integration_check: 'accept_a_payment'},
        }).then(async () => {
          var newOrder = await new OrderModel({
            user : user._id,
            products : req.body.orderProducts,
            productsQuantity : req.body.productsQuantity,
            cost : req.body.totalOrder,
            delivery_address : req.body.orderAddress,
            delivery_city : req.body.orderCity,
            delivery_zipCode : req.body.orderZipCode,
            date_insert : new Date(),
          })
          await newOrder.save();
    
          for(var i = 0; i < newOrder.products.length; i++) {
            let currentProduct = await ProductModel.findOne({_id: newOrder.products[i]});
            if(currentProduct) {
              await ProductModel.updateOne({_id: newOrder.products[i]}, {soldNumber: currentProduct.soldNumber + 1, stock: currentProduct.stock - 1});
            }
          }
        
          await user.orders.push(newOrder._id);
          await user.panier.splice(0, user.panier.length);
          await user.productsQuantity.splice(0, user.productsQuantity.length);
          await user.save();
    
          res.clearCookie('orderCart', {path:'/'});
          res.clearCookie('orderAddress', {path:'/'})
    
          res.json({result: true});
        });
      })();
      
    }
  });
})

router.get('/getCookiesOrder', async function(req, res) {
  if(req.cookies.orderCart && !req.cookies.orderAddress) {
    res.json({result : true, cartCookies : req.cookies.orderCart})
  } else if(req.cookies.orderCart && req.cookies.orderAddress) {
    var productsCart = await UserModel.findOne({token: req.query.userToken}).populate('panier')
    res.json({result : true, cartCookies : req.cookies.orderCart, addressOrderCookies : req.cookies.orderAddress, productsCart: productsCart})
  } else {
    res.json({result : false})
  }
})

router.post('/addComment', async function(req, res) {
  var idUser;
  var user = await UserModel.findOne({token: req.body.userToken});

  // var randomName = Math.floor(Math.random() * 1000000)
  // var photoPath = `public/images/picture-${randomName}.jpg`;

  // req.files.photo.mv(photoPath,
  //   function(err) {
  //     cloudinary.v2.uploader.upload(photoPath,
  //       function(error, result){
  //         if(result){

  //           console.log('This the result -->',result)
          
  //         } else {

  //           console.log('this is the error --->',error)
  //           res.json({result: false, message: 'File not uploaded!'} );

  //         }
  //       })
  // })


  idUser = user._id;
  await ProductModel.findOne({_id: req.body.idProduct}).populate({path: 'comments', populate: { path: 'user', model : UserModel}}).exec(async function(err, product) {
    if(product) {
      var newComment = await new CommentModel({
        title: req.body.title,
        message: req.body.message,
        date: new Date(),
        user : idUser,
        note : req.body.note,
        images : req.body.images
      })
      
      await product.comments.push(newComment._id);
      var getCurrentNotes = 0;
      //Permet de récuperer e total des notes du produit
      if(product.comments.length > 0) {
        for(var i = 0; i < product.comments.length; i++) {
          if(product.comments[i].note) {
            getCurrentNotes += product.comments[i].note;
          }
        }
      }
      var total = getCurrentNotes + req.body.note
      let newNote = total / product.comments.length;
      await ProductModel.updateOne({_id: req.body.idProduct}, {note: newNote});

      await user.comments.push(newComment._id);

      await newComment.save();
      await product.save()
      await user.save();

      res.json({result : product})
    }
  })
})


router.get('/getUserOrders', async function(req, res) {
  await UserModel.findOne({token: req.query.userToken}).populate({path: 'orders', populate: {path: 'products', model : ProductModel}}).exec(function(err, user) {
    console.log(user)
    if(user) {
      res.json({result: user});
    }
  })
})

router.post('/deleteAddress', async function(req, res) {
    await UserModel.updateOne({token: req.body.userToken}, { $unset : req.body.addressNumber === 1 ? { homeAddress : 1} : { secondaryAddress : 1} });
    await UserModel.findOne({token: req.body.userToken}, function(err, user) {
      if(user) {
        res.json({result : user});
      }
    })
})

router.post('/editAddress', async function(req, res) {
  await UserModel.updateOne({token : req.body.userToken},
    req.body.addressNumber === 1 ?
      {homeAddress: {address : req.body.address, city : req.body.city, zipCode : req.body.zipCode}} :
      {secondaryAddress: {address : req.body.address, city : req.body.city, zipCode : req.body.zipCode}}
  )
  await UserModel.findOne({token: req.body.userToken}, function(err, user) {
    if(user) {
      let wichAddress;
      if(req.body.addressNumber === 1) {
        wichAddress = 1;
      } else {
        wichAddress = 2;
      }
      res.json({result : user, wichAddress : wichAddress});
    }
  })
})

module.exports = router;
