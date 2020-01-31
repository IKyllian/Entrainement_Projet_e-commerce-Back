var express = require('express');
var router = express.Router();

var ProductSchema = require('../Models/product');
var UserSchema = require('../Models/user');
var OrderSchema = require('../Models/order');

// const products = [
//   {
//     name : 'Faber-Castell 110088 Set de crayons de couleur Art & Graphic',
//     description : 'Pour l\'artiste, ils sont un outil de travail représentatif, pour l\'esthète un objet de design décoratif : les coffrets élégants en bois teinté couleur wengé. L\'assortiment de base et les accessoires assortis se prêtent à chaque créatif comme outil de travail prestigieux. Un assortiment de base de crayons de couleur pour artistes et de pastels Polychromos, de crayons de couleur aquarellables Albrecht Dürer ainsi qu\'un petit assortiment de PITT Monochrome se présente sur deux niveaux',
//     prix: '160',
//     note: '5',
//     stock : '7',
//     images : ['https://images-na.ssl-images-amazon.com/images/I/91zXALacchL._AC_SX425_.jpg'],
//     type : 'crayon-couleur'
//   },
//   {
//     name : 'Pochette feutres Pitt artist Pen Noir - Faber-Castell',
//     description : 'La gamme PITT artist pen « Brush » se décline en 60 couleurs : les couleurs claires offrent la possibilité de jouer avec les transparences, tandis que les couleurs sombres ont un pouvoir couvrant plus marqué. La pointe « pinceau B » de grande qualité permet une application douce de l’encre sur le papier. La largeur des traits varie selon l’angle et la pression exercée sur le feutre. Même une fois repliée, la pointe reste parfaitement opérationnelle et ne rompt pas. Une fois sèche, l’encre devient permanente et peut être combinée avec des crayons aquarellables.',
//     prix: '15',
//     note: '5',
//     stock : '10',
//     images : ['https://www.dalbe.fr/4184-large_default/pochette-feutres-pitt-artist-pen-noir-faber-castell.jpg'],
//     type : 'feutre'
//   },
//   {
//     name : 'Set de 12 + 1 Promarker',
//     description : 'Pour l\'artiste, ils sont un outil de travail représentatif, pour l\'esthète un objet de design décoratif : les coffrets élégants en bois teinté couleur wengé. L\'assortiment de base et les accessoires assortis se prêtent à chaque créatif comme outil de travail prestigieux. Un assortiment de base de crayons de couleur pour artistes et de pastels Polychromos, de crayons de couleur aquarellables Albrecht Dürer ainsi qu\'un petit assortiment de PITT Monochrome se présente sur deux niveaux',
//     prix: '160',
//     note: '5',
//     stock : '7',
//     images : ['https://images-eu.ssl-images-amazon.com/images/I/51WXjhWDSVL._SL500_AC_SS350_.jpg'],
//     type : 'marqueur'
//   },
//   {
//     name : 'Canson - Pochette de 12 feuilles de papier dessin CA GRAIN 180g - 24x32cm',
//     description : 'La pochette Canson "C" à grain propose un papier dessin blanc grain fin unique. Déclinée en 3 grammages, ce papier est idéal pour le dessin réalisé au crayon de papier, crayon de couleur ou feutre mais également pour le travail à l\'encre ou à la gouache. ',
//     prix: '6',
//     note: '3',
//     stock : '15',
//     images : ['https://fr.canson.com/sites/default/files/pochette-cagrain-1.jpg'],
//     type : 'papier'
//   },
//   {
//     name : 'Papier peinture blanc naturel, 370g/m² en 24x32cm - Pochette de 6 feuille',
//     description : 'Pochette 6 feuilles dessins blanc naturel, 370g/m² en 24x32cm Grain léger, ne gondole pas, idéal pour la peinture (gouache, acrylique, aquarelle, encre) ',
//     prix: '5',
//     note: '4.5',
//     stock : '0',
//     images : ['https://www.lacentraledubureau.com/images/products/30896.jpg'],
//     type : 'papier'
//   },
//   {
//     name : 'Boîte métal 12 crayons graphite CASTELL 9000 DESIGN',
//     description : 'Boîte métal 12 crayons graphite CASTELL 900012 duretés de mine: 2B,3B,4B,B,HB,F,H,2H,3H,4H,5H,6HDes crayons de qualité exceptionnelle, la mine est produite à partir des meilleurs graphites et argiles, collée (procédé de résistance SV), vernis écologique à l’eau, cèdre rose de Californie.Code EAN sur chaque crayon.',
//     prix: '15',
//     note: '5',
//     stock : '7',
//     images: ['https://www.rougier-ple.fr/phproduct20140204/P_74950_P_1_PRODUIT.jpg'],
//     type : 'crayon-papier'
//   },
// ]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.clearCookie('MyCookie')
  res.render('index', { title: 'Express' });
});

//Route qui permet d'inserer des produits en bdd
// router.post('/addProducts', async function(req, res, next) {
//   for(var i = 0; i < products.length; i++) {
//     var newProduct = await new ProductSchema({
//       name : products[i].name,
//       description : products[i].description,
//       price : products[i].prix,
//       note : products[i].note,
//       images : products[i].images,
//       stock : products[i].stock,
//       type : products[i].type
//     })

//     await newProduct.save();
//   }
//   res.json({result : true})
// })

router.get('/getProducts', async function(req, res) {
  var getProducts = await ProductSchema.find(); //Va chercher tous les produits en bdd

  res.json({products : getProducts}) //Renvoie les infos au front
})

router.get('/product', async function(req, res) {
  var getProduct = await ProductSchema.findById({_id: req.query.id}) //Permet d'aller recuperer un produit grace a son id, que l'on recupere depuis le front
  res.json({product : getProduct}) //Renvoie les infos au front
})

router.post('/addProduct', async function(req, res) {
  await UserSchema.findOne({token: req.body.userToken}, function(err, user) {
    //Push l'id du produit dans le tableau panier du user
    user.panier.push(req.body.idProduct);
    user.save();
  })
})

router.get('/dataHeaderPanier', async function(req, res) {
    await UserSchema.findOne({token: req.query.userToken}).populate('panier').exec(function(err, user) {
      if(user) {
        console.log(user)
        res.json({result: user})      
      } else {
        res.json({result: false})      
      }
    });
})


router.get('/getUserPanier', async function(req, res) {
  await await UserSchema.findOne({token: req.query.userToken}).populate('panier').exec(function(err, datas) {
    res.json({result: datas})
  })
})

router.post('/deleteProduct', async function(req, res) {
    await UserSchema.findOne({token: req.body.userToken}).populate('panier').exec(function(err, user) {
      user.panier.splice(req.body.positionProduct, 1);
      user.save()
      res.json({result : user});
    })
})

router.post('/addAddress', async function(req, res) {
    await UserSchema.findOne({token: req.body.userToken}, function(err, user) {
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


router.post('/createOrder', async function(req, res) {
  await UserSchema.findOne({token : req.body.userToken}, async function(err, user) {
    if(user) {
      var newOrder = await new OrderSchema({
        user : user._id,
        products : req.body.orderProducts,
        cost : req.body.totalOrder,
        delivery_address : req.body.orderAddress,
        delivery_city : req.body.orderCity,
        delivery_zipCode : req.body.orderZipCode,
        date_insert : new Date(),
      })
      await newOrder.save();
    
      await user.orders.push(newOrder._id);
      await user.panier.splice(0, user.panier.length);
      await user.save();
    
      console.log(newOrder);
    
      res.json({result: true});
    }
  });
  
  

})
module.exports = router;
