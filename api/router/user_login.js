const express = require('express');
const Login = require('../../model/user/login');
const nodemailer = require('nodemailer');
const otpgenerator = require('otp-generator');

const router = express.Router();

// ROUTER FOR LOGIN AND GENERATE OTP :

router.post('/',(req,res,next)=>{
    const otp = otpgenerator.generate(5);
    console.log(otp);
    const login = new Login({
        email: req.body.email,
        otp: otp
    });
    login
    .save()
    .then(doc => {
        const email = req.body.email
        let transporter = nodemailer.createTransport({
            service : 'gmail',
            host:'smtp.gmail.com',
            auth: {
                user: 'bigbossofficial9@gmail.com',
                pass : 'bigbossofficial'
            }
        })
          var mailOptions = {
              from: 'bigbossofficial9@gmail.com',
              to : email,
              subject: 'Hello user !!',
              description:'Use otp for further login.',
              text:otp

           }
            
          transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            })
        res.status(201).json({
            type: 'POST',
            message:'use your otp for further login process through bellow link',
            url:'http://localhost:8888/userlogin/user/login'
        });
    })
    .catch(err =>{
        res.status(500).json({error : err});
    });
});

// ROUTER FOR LOGIN VERIFICATION :

router.post('/user/login',async(req,res)=>{
    try{
        const log = await Login.findByCredentials(req.body.email,req.body.otp)
        res.status(200).json({
            message:'you have logged in sucessfully.Please complete your profile through further link'
        });        
    }catch(e){
        res.status(400).send()
    };
});

// // ROUTER FOR USER DETAILS :

// router.post('/user',(req,res,next) => {

// });


module.exports = router;