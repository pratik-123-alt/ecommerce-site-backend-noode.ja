const express = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null, file.originalname);
    }
});

const upload = multer({storage : storage});

const router = express.Router();
const auth = require('../middleware/check-auth');
const Product = require('../../model/admin/product');


//ROUTER FOR POST REQUEST :

router.post('/',auth,upload.array('image',5),(req,res,next) => {
    let imageArr = [];
    if(req.files.length){
        req.files.forEach((filePath,index)=> {
            if (filePath) {
                imageArr.push(filePath['path']);
            }
        });
    }
    console.log(req.files);
    const product = new Product({
        catid: req.body.catid,
        brandid: req.body.brandid,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        specification: req.body.specification,
        image: imageArr
    });

    product
    .save()
    .then(doc => {
        res.status(201).json({
            message: 'Category Created Sucessfully !!',
            product_details : {
                catid: req.body.catid,
                brandid: req.body.Brand_id,
                name: req.body.name,
                description: req.body.description,
                proce: req.body.price,
                specification: req.body.specification,
                image: imageArr,
                request:{
                    type: 'GET',
                    url: 'http://localhost:8888/product/' + doc._id
                }
            }
        });    
    })
    .catch(er => {
        res.status(500).json({
            error: er
        })
    });

});

// ROOUTER TO FIND ALL CATEGORY :

router.get('/',(req,res,next) => {
    Product.find()
    .select("_id catid brandid name description price specification image")
    .populate('catid','name')
    .populate('brandid','brand')
    .exec()
    .then(result =>{
        const responce = {
            count : result.length,
            product_created : result.map(result => {
                return{
                    _id: result._id,
                    catid: result.catid,
                    brandid: result.brandid,
                    name: result.name,
                    description: result.description,
                    price: result.price,
                    specification: result.specification,
                    image: result.image,
                    request:{
                        type: 'GET',
                        description: 'Click link to find indivisual details',
                        url: 'http://localhost:8888/product/' + result._id
                    }
                }
            })
        }
        if (result.length >= 0) {
            res.status(200).json(responce);
            
        } else {
            res.json({
                message:'NO DATA FOUND !!'
            })
        }
    })
    .catch(err => {
        res.status(500).json({ error : err});
    });
});

// ROUTER TO FIND CATEGORY BY _ID :
router.get('/:proId',(req,res,next) => {
    const id = req.params.proId;
    Product.findById(id)
    .select("_id catid brandid name description specification image")
    .populate('catid','name')
    .populate('brandid','brand')
    .exec()
    .then(result =>{
        const responce = {
            count : result.length,
            product_created : result.map(result => {
                return{
                    _id: result._id,
                    catid: result.catid,
                    brandid: result.brandid,
                    name: result.name,
                    description: result.description,
                    price: result.price,
                    specification: result.specification,
                    image: result.image,
                    request:{
                        type: 'GET',
                        description: 'Click link to find product details',
                        url: 'http://localhost:8888/product/' 
                    }
                }
            })
        }
        if (result.length >= 0) {
            res.status(200).json(responce);
            
        } else {
            res.json({
                message:'NO DATA FOUND !!'
            })
        }
    })
    .catch(err => {
        res.status(500).json({ error : err});
    });
});

// ROUTER REQUEST FOR UPDATE CATEGORIES :
router.patch('/:proId',auth,(req,res,next) => {
    const id = req.params.proId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id : id},{$set:updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message : 'Updated Sucessfully',
            request:{
                type:'GET',
                description:'Check updated product bellow',
                url:'http://localhost:8888/product/'+id
            }
    
    })
})
    .catch(err => {
        res.status(500).json({error:err})
    });
});

// ROUTER FOR REMOVE REQUETS :
router.delete('/:proId',auth,(req,res,next) => {
    const id = req.params.proId;
    Product.remove({_id : id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product Deleted',
            request: {
                description:'Hey!! you can have a look of remaning product ',
                url: 'http://localhost:8888/product/'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
    });
});

module.exports = router;
