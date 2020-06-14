const express = require('express');
const Admin = require('../../model/admin/admin');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/', (req,res,next) => {
    Admin.find({})
    .exec()
    .then(A => {
        if(A.length >= 2) {
            return res.status(409).json({
                message:'One Admin already exist !!'
            });
        }else{
            bcrypt.hash(req.body.Password,8,(err,hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    const A = new Admin({
                        FirstName: req.body.FirstName,
                        LastName: req.body.LastName,
                        Email: req.body.Email,
                        Password: hash
                    });
                    A 
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: 'Admin registration done !!'
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            })
        }
    })

});


router.post('/login',async(req,res,next)=>{
    Admin.find({email: req.body.email})
    .exec()
    .then(Admin => {
        if(Admin.length <= 0){
            res.status(404).json({message:'Something is wrong'})
        }
        try{
            const log =  Admin.findByCredentials(req.body.email,req.body.password)
            const token =  log.generateAuthToken()
            res.status(200).json({
                message : "login sucessfully",
                token : token
            })
        }catch(e){
            res.status(400).send(e)
        }
    })
    
})



module.exports = router;
