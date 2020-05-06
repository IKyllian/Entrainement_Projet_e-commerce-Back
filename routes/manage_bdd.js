var express = require('express');
var router = express.Router();

var ProductModel = require('../Models/product');
var UserModel = require('../Models/user');
var OrderModel = require('../Models/order');
var CommentModel = require('../Models/comment');
var PanierModel = require('../Models/panier');
var MessageModel = require('../Models/message');
var NewsletterModel = require('../Models/newsletter');
var PromoCodeModel = require('../Models/promo_code');

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


const usersGenerator = [
    {
      first_name : 'Maury',
      last_name : 'Richard',
      email : 'richard@gmail.com',
      dateInsert: new Date('2020-01-03'),
      role : 'user',
    },
    {
      first_name : 'Navarro',
      last_name : 'Pauline',
      email : 'pauline@gmail.com',
      dateInsert: new Date('2020-01-11'),
      role : 'user',
    },
    {
      first_name : 'Nguyen',
      last_name : 'Hélène',
      email : 'hélène@gmail.com',
      dateInsert: new Date('2020-01-20'),
      role : 'user',
    },
    {
      first_name : 'Guyon',
      last_name : 'Alice',
      email : 'alice@gmail.com',
      dateInsert: new Date('2020-02-10'),
      role : 'user',
    },
    {
      first_name : 'Chauvet',
      last_name : 'Honoré',
      email : 'honoré@gmail.com',
      dateInsert: new Date('2020-02-15'),
      role : 'user',
    },
  ]

router.post('/addFieldOrders', async function(req, res) {
    await OrderModel.updateMany({ }, {$set: {discount : null }}, function(err, users) {
      //res.json(err)
      res.json(users)
    });
})

//Route qui permet d'inserer des produits en bdd
router.post('/addProducts', async function(req, res) {
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


router.post('/addFieldUsers', async function(req, res) {
    await UserModel.updateMany({ }, {$set: {discount_codes : [] }}, function(err, users) {
      //res.json(err)
      res.json(users)
    });
});

  router.post('/generatorUsers', async function(req, res) {
    for(var i = 0; i < usersGenerator.length; i++) {
      var salt = uid2(32);
      var token = uid2(32);
      var newUser = await new UserModel({
          first_name : usersGenerator[i].first_name,
          last_name : usersGenerator[i].last_name,
          email : usersGenerator[i].email,
          salt : salt,
          password : SHA256('aze' + salt).toString(encBase64), //Hashé le mot de passe 
          token : token,
          role : 'user',
          dateInsert : usersGenerator[i].dateInsert,
          panier : [],
          productsQuantity : [],
      })
      await newUser.save();
    }
    res.json({response: 'ok'})
  })

  router.post('/createAdminUser', async function(req, res) {
    var salt = uid2(32);
    var token = uid2(32);
    var password = 'aze';
    var newAdmin = await new UserModel({
      first_name : 'Admin',
      last_name : 'kyllian',
      email : 'adminKD@gmail.com',
      salt : salt,
      password : SHA256(password + salt).toString(encBase64), //Hashé le mot de passe 
      role : 'admin',
      token: token,
      panier : [],
      productsQuantity : [],
    })
    await newAdmin.save();
    res.send('ok');
  })

  router.post('/addFieldComments', async function(req, res) {
    await CommentModel.updateMany({ }, {$unset: {responses : "" }}, function(err, users) {
      //res.json(err)
      res.json(users)
    });
});


  module.exports = router;
