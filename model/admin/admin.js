const mongoose = require('mongoose');
const validator = require('validator');
const validation = require('validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminSchema = mongoose.Schema({
    FirstName : {
        type : String,
        trim : true,
        required : true
    },
    LastName : {
        type : String,
        trim : true,
        required : true
    },
    Email : {
        type : String,
        trim : true,
        required : true,
        lowercase : true,
        
        validate(value){
            if(! validator.isEmail(value)){
                throw new Error('Enter a valid Email addresss!!')
            }
        }

    },
    Password : {
        type : String,
        trim : true,
        require : true,
        isdigits : true,
        minlength : 8,
        validate(value){
            if(!validator){
                throw new Error('error')
            }
        }

    },
   
},{
    timestamps : true
});

adminSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()},'thisismyway')
    return token
};
// adminSchema.statics.findByCredentials = async (email,password) =>{
//     const user = await Admin.findOne({email})
//     if (!user) {
//         throw new Error('Error in login !!')        
//     }

//     const isMatch = await bcrypt.compare(password,user.password)

//     if(!isMatch){
//         throw new Error('Error in login !!')
//     }

//     return user
// }
// adminSchema.pre('save', async function(next){
//     const admin = this
//     admin.password = await bcrypt.hash(admin.password,8)
//     next()
// });

Admin = mongoose.model('admin',adminSchema);

module.exports = Admin;