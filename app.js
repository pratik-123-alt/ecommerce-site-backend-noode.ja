const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ShoopingCart',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const morgan = require('morgan');


const admin = require('./api/router/admin_router');
const brand = require('./api/router/brand_router');
const category = require('./api/router/category-route');
const product = require('./api/router/product_router');
const login = require('./api/router/user_login');

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());

// PROTECT FROM Handling_CORS
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Contrl-Allow-Origin",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Method', 'PUT,GET,POST,DELETE,PATCH');
        return res.status(200).json({});
    }
    next();
});

// ROUTING API CALL :-
app.use('/admin',admin);
app.use('/brand',brand);
app.use('/category',category);
app.use('/product',product);
app.use('/userlogin',login);

module.exports = app;