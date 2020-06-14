const mongoose = require('mongoose');

userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
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
    address:[{
        type: String,
        required:true,
    }],
});

module.exports = mongoose.model('User',userSchema);