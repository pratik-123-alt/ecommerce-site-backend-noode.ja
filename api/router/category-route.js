const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
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

const Category = require('../../model/admin/category');
const Auth = require('../middleware/check-auth');
const router = express.Router();

//ROUTER FOR POST REQUEST :

router.post('/',Auth,upload.array('categoryimage',2),(req,res,next) => {
    let imageArr = [];
    if(req.files.length){
        req.files.forEach((filePath,index)=> {
            if (filePath) {
                imageArr.push(filePath['path']);
            }
        });
    }
    console.log(req.files);
    const category = new Category({
        
        name: req.body.name,
        Brand_id: req.body.Brand_id,
        description: req.body.description,
        categoryimage: imageArr
    });

    category.save()
    .then(doc => {
        res.status(201).json({
            message: 'Category Created Sucessfully !!',
            createdCategory : {
                name: req.body.name,
                Brand_id: req.body.Brand_id,
                description: req.body.description,
                categoryimage: doc.categoryimage,
                request:{
                    type: 'GET',
                    url: 'http://localhost:8888/category/' + doc._id
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
    Category.find()
    .select("_id name Brand_id description categoryimage")
    .populate('Brand_id','brand')
    .exec()
    .then(result =>{
        const responce = {
            count : result.length,
            Category : result.map(result => {
                return{
                    _id: result._id,
                    name : result.name,
                    Brand_id : result.Brand_id,
                    description : result.description,
                    categoryimage: result.categoryimage,
                    request:{
                        type: 'GET',
                        description: 'Click link to find indivisual details',
                        url: 'http://localhost:8888/category/' + result._id
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
router.get('/:catId',(req,res,next) => {
    const id = req.params.catId;
    Category.findById(id)
    .select("_id name Brand_id description categoryimage")
    .populate('Brand_id')
    .exec()
    .then(result =>{
        if ( result ) {
            res.status(200).json({
                _id: result._id,
                name : result.name,
                Brand_id : result.Brand_id,
                description : result.description,
                categoryimage: result.categoryimage,
                request:{
                    type: 'GET',
                    description: 'Click link to find all category',
                    url: 'http://localhost:8888/category/' 
                }
            });
            
        } else {
            res.json({
                message:'NOT A VALID ENTRY !!'
            })
        }
    })
    .catch(err => {
        res.status(500).json({ error : err});
    });
});

// ROUTER REQUEST FOR UPDATE CATEGORIES :
router.patch('/:catId',Auth,(req,res,next) => {
    const id = req.params.catId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Category.update({_id : id},{$set:updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message : 'Updated Sucessfully',
            request:{
                type:'GET',
                description:'Check updated categories bellow',
                url:'http://localhost:8888/category/'+id
            }
    
    })
})
    .catch(err => {
        res.status(500).json({error:err})
    });
});

// ROUTER FOR REMOVE REQUETS :
router.delete('/:catId',Auth,(req,res,next) => {
    const id = req.params.catId;
    Category.remove({_id : id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product Deleted',
            request: {
                description:'Hey!! you can have a look of remaning categories ',
                url: 'http://localhost:8888/category/'
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