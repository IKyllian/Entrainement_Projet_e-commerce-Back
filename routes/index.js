var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');

var ProductModel = require('../Models/product');
var UserModel = require('../Models/user');
var OrderModel = require('../Models/order');
var CommentModel = require('../Models/comment');
var PanierModel = require('../Models/panier');

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
  {
    name : 'Faber-Castell 110088 Set de crayons de couleur Art & Graphic',
    description : 'Pour l\'artiste, ils sont un outil de travail représentatif, pour l\'esthète un objet de design décoratif : les coffrets élégants en bois teinté couleur wengé. L\'assortiment de base et les accessoires assortis se prêtent à chaque créatif comme outil de travail prestigieux. Un assortiment de base de crayons de couleur pour artistes et de pastels Polychromos, de crayons de couleur aquarellables Albrecht Dürer ainsi qu\'un petit assortiment de PITT Monochrome se présente sur deux niveaux',
    prix: 160,
    note: 0,
    stock : 7,
    images : ['https://images-na.ssl-images-amazon.com/images/I/91zXALacchL._AC_SX425_.jpg'],
    type : 'crayon-couleur',
    soldNumber :0
  },
  {
    name : 'Pochette feutres Pitt artist Pen Noir - Faber-Castell',
    description : 'La gamme PITT artist pen « Brush » se décline en 60 couleurs : les couleurs claires offrent la possibilité de jouer avec les transparences, tandis que les couleurs sombres ont un pouvoir couvrant plus marqué. La pointe « pinceau B » de grande qualité permet une application douce de l’encre sur le papier. La largeur des traits varie selon l’angle et la pression exercée sur le feutre. Même une fois repliée, la pointe reste parfaitement opérationnelle et ne rompt pas. Une fois sèche, l’encre devient permanente et peut être combinée avec des crayons aquarellables.',
    prix: 15,
    note: 0,
    stock : 10,
    images : ['https://www.dalbe.fr/4184-large_default/pochette-feutres-pitt-artist-pen-noir-faber-castell.jpg'],
    type : 'feutre',
    soldNumber :0
  },
  {
    name : 'Set de 12 + 1 Promarker',
    description : 'Pour l\'artiste, ils sont un outil de travail représentatif, pour l\'esthète un objet de design décoratif : les coffrets élégants en bois teinté couleur wengé. L\'assortiment de base et les accessoires assortis se prêtent à chaque créatif comme outil de travail prestigieux. Un assortiment de base de crayons de couleur pour artistes et de pastels Polychromos, de crayons de couleur aquarellables Albrecht Dürer ainsi qu\'un petit assortiment de PITT Monochrome se présente sur deux niveaux',
    prix: 160,
    note: 0,
    stock : 7,
    images : ['https://images-eu.ssl-images-amazon.com/images/I/51WXjhWDSVL._SL500_AC_SS350_.jpg'],
    type : 'marqueur',
    soldNumber :0
  },
  {
    name : 'Canson - Pochette de 12 feuilles de papier dessin CA GRAIN 180g - 24x32cm',
    description : 'La pochette Canson "C" à grain propose un papier dessin blanc grain fin unique. Déclinée en 3 grammages, ce papier est idéal pour le dessin réalisé au crayon de papier, crayon de couleur ou feutre mais également pour le travail à l\'encre ou à la gouache. ',
    prix: '6',
    note: '0',
    stock : '15',
    images : ['https://fr.canson.com/sites/default/files/pochette-cagrain-1.jpg'],
    type : 'papier',
    soldNumber :0
  },
  {
    name : 'Papier peinture blanc naturel, 370g/m² en 24x32cm - Pochette de 6 feuille',
    description : 'Pochette 6 feuilles dessins blanc naturel, 370g/m² en 24x32cm Grain léger, ne gondole pas, idéal pour la peinture (gouache, acrylique, aquarelle, encre) ',
    prix: '5',
    note: '0',
    stock : '0',
    images : ['https://www.lacentraledubureau.com/images/products/30896.jpg'],
    type : 'papier',
    soldNumber :0
  },
  {
    name : 'Boîte métal 12 crayons graphite CASTELL 9000 DESIGN',
    description : 'Boîte métal 12 crayons graphite CASTELL 900012 duretés de mine: 2B,3B,4B,B,HB,F,H,2H,3H,4H,5H,6HDes crayons de qualité exceptionnelle, la mine est produite à partir des meilleurs graphites et argiles, collée (procédé de résistance SV), vernis écologique à l’eau, cèdre rose de Californie.Code EAN sur chaque crayon.',
    prix: '15',
    note: '0',
    stock : '7',
    images: ['https://www.rougier-ple.fr/phproduct20140204/P_74950_P_1_PRODUIT.jpg'],
    type : 'crayon-papier',
    soldNumber : 0
  },
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
  // await ProductModel.findById({_id: req.query.id}, function(err, product) {
  //   if(product) {
  //     console.log(product)
  //     CommentModel.populate({
  //       select: 'user',
  //       model: UserModel
  //     }, function(err, result) {
  //       console.log(result)
  //     })
  //     res.json({result : product}) //Renvoie les infos au front
  //   }
  // }) 
 })

router.post('/addProduct', async function(req, res) {
  console.log('Execute')
    await UserModel.findOne({token: req.body.userToken}, function(err, user) {
      //Push l'id du produit dans le tableau panier du user
      if(user) {
        let idProduct = req.body.idProduct
        user.panier.push(idProduct);
        user.save();
        res.status(200).send('ok')
      }
    })
})

router.get('/addProductCookie', async function(req, res) {
  await ProductModel.findOne({_id: req.query.idProduct}, async function(err, product) {
    if(product) {
      if(!req.cookies.cartNotConnected) {
        var newPanier = await new PanierModel({
          products: req.query.idProduct,
        })
        await newPanier.save()
        res.cookie('cartNotConnected', {panierId: newPanier._id},
          {path:'/'}).send('Ok.');
      } else {
        await PanierModel.findOne({_id: req.cookies.cartNotConnected.panierId}, function(err, panier){
          if(panier) {
            panier.products.push(req.query.idProduct);
            panier.save()
            res.status(200).send('ok')
          }
        })
      }  
    }
  })
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
        user.panier.splice(req.body.positionProduct, 1);
        user.save()
        res.json({result : user});
      } else if(req.cookies.cartNotConnected) {
        await PanierModel.findOne({_id: req.cookies.cartNotConnected.panierId}).populate('products').exec(function(err, panier) {
          if(panier) {
            panier.products.splice(req.body.positionProduct, 1);
            panier.save()
            res.json({resultCookie : panier});
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
      var newOrder = await new OrderModel({
        user : user._id,
        products : req.body.orderProducts,
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
          await ProductModel.updateOne({_id: newOrder.products[i]}, {soldNumber: currentProduct.soldNumber + 1});
        }
      }
    
      await user.orders.push(newOrder._id);
      await user.panier.splice(0, user.panier.length);
      await user.save();

      res.clearCookie('orderCart', {path:'/'});
      res.clearCookie('orderAddress', {path:'/'})

      res.json({result: true});
    }
  });
})

router.get('/getCookiesOrder', function(req, res) {
  if(req.cookies.orderCart && !req.cookies.orderAddress) {
    res.json({result : true, cartCookies : req.cookies.orderCart})
  } else if(req.cookies.orderCart && req.cookies.orderAddress) {
    res.json({result : true, cartCookies : req.cookies.orderCart, addressOrderCookies : req.cookies.orderAddress})
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
        //images : req.body.images
      })
      
      await product.comments.push(newComment._id);
      var getCurrentNotes = 0;
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
