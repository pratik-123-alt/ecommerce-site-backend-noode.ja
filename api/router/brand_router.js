const express = require('express');
const auth = require('../middleware/check-auth');
const Brand = require('../../model/admin/brand');
const router = express.Router();

// ROUTER FOR POST REQUEST :
router.post('/',auth,(req,res,next)=>{
   const brand = new Brand({
       brand: req.body.brand
   });
   brand
   .save()
   .then(result => {
       console.log(result);
       res.status(201).json({
        message:'Data saved sucessfully !!',
        createdBrand : {
            brand: result.brand,
            _id : result._id,
            request:{
                type: 'GET',
                url: 'http://localhost:8888/brand/' + result._id
            }
        }
    });
   })
   .catch((err)=>{
       console.log(err);
       res.status(500).json({error : err});
   });
 
});

//ROUTER TO FIND BRAND BY ID :
router.get('/:brandId',auth,(req,res,next)=>{
    const id = req.params.brandId;
    Brand.findById(id)
        .select("brand _id")
        .exec()
        .then(doc => {
            console.log('From Database',doc);
            if (doc) {
                res.status(200).json({
                    brand : doc,
                    request : {
                        tyep:'GET',
                        description:'Get all products',
                        url: 'http://localhost:8888/brand/' 
                    }
                });

            } else {
                res.status(404).json({message:'No  Valid Entry Foun'})
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error : err})
        })
});


// ROUTER TO FIND ALL BRAND :
router.get('/',auth,(req,res,next) => {
    Brand.find()
    .select("brand _id")
    .exec()
    .then(docs => {
        const responce = {
            count : docs.length,
            Brand : docs.map(doc => {
                return {
                    brand : doc.brand,
                    _id : doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8888/brand/' + doc._id
                    }

                }
            })
        }
        if (docs.length >= 0) {
            res.status(200).json(responce)
        } else {
            res.json({message : 'no data found !!'})
        }
       
    })
    .catch(err => {
        res.status(500).json({error:err})
    });
});

//ROUTER FOR UPDATE REQUEST :
router.patch('/:brandId',auth,(req,res,next) => {
    const id = req.params.brandId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Brand.update({_id : id},{$set:updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message : 'Updated Sucessfully',
            request:{
                type:'GET',
                description:'Check updated brand bellow',
                url:'http://localhost:8888/brand/'+id
            }
    
    })
})
    .catch(err => {
        res.status(500).json({error:err})
    });
});

// ROUTER FOR REMOVE REQUETS :
router.delete('/:brandId',auth,(req,res,next) => {
    const id = req.params.brandId;
    Brand.remove({_id : id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product Deleted',
            request: {
                description:'Hey!! you can add a brand ',
                type:'POST',
                url:'http://localhost:8888/brand/',
                body:{brand:'String'}
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