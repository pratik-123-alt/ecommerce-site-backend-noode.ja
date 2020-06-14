const  mongoose = require('mongoose');

const prodSchema = mongoose.Schema({
    catid:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required : true
    },
    brandid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Brand',
        required : true
    },
    name:{
        type : String,
        required : true
    },
    description:{
        type : String,
        required : true
    },
    price:{
        type : Number,
        required : true
    },
    specification:{
        type : String,
        required :  true
    },
    image:[{
        type : String,
        required : true
    }]
},{
    timestamps : true
}
);

module.exports = mongoose.model('Product',prodSchema);
