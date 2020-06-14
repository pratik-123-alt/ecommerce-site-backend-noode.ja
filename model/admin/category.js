const mongoose = require('mongoose');


const catSchema = mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    Brand_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    }],
    description:{
        type: String,
        required: true
    },
    categoryimage:[{
        type:String,
        required:true
    }]
},{
    timestamps : true
});


module.exports = mongoose.model('Category',catSchema);