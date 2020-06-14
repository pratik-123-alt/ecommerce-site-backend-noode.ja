const mongoose = require('mongoose');
const validation = require('validation');
const validator = require('validator');
const bcrypt = require('bcrypt');

loginSchema = mongoose.Schema({
    username : {
        type: String,
        //required: true,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Enter a valid email address !!')
            }
        }

    },
    otp:{
        type: String
    },
    address:[{
        type: String,
        required: true
    
    }],
});


loginSchema.pre('save', async function(next){
    const log = this
    log.otp = await bcrypt.hash(log.otp,8)
    next()

});

loginSchema.statics.findByCredentials = async (email,otp) =>{
    const user = await Login.findOne({email})
    console.log(user)
    // if(user){
    //     throw new Error('You have allready logged in by this email')
        
    // }

    if (!user) {
        throw new Error('Error in login !!')        
    }

    const isMatch = await bcrypt.compare(otp,user.otp)

    if(!isMatch){
        throw new Error('Error in login !!')
    }

    return user
}

module.exports = mongoose.model('Login',loginSchema);