const http = require('http');

dotenv.config();


const port = process.env.PORT






const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');
const dotenv = require('dotenv');

//importing the routes
const parcelRoutes = require('./api/routes/parcels');
const userRoutes = require('./api/routes/users');
const destinationRoutes =require('./api/routes/destinations');


//mongoose is a package that works with the database to store data, fetch data 
//Connect to the db
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false},
     ()=> console.log('connected to db')
     );

mongoose.Promise =global.Promise;

//morgan is middle ware for automatic logging || bodyParser is a dependency for extracting body requests
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//middleware for handling CORS (Cross origin resource sharing)
app.use((req, res, next)=>{
    res.header('Acess-Control-Allow-Origin', '*');
    res.header('Acess-Control-Allow-Headers', 'Origin, X-Requested-with, Content-type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Acess-Control-Allow-methods', 'PUT, POST, PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

//Middleware for handling routes
app.use('/parcels', parcelRoutes );
app.use('/users', userRoutes);
app.use('/destinations', destinationRoutes);

// middleware for handling errors
app.use((req, res,next)=>{
    const error = new Error('Not found');
    error.status=404;
    next(error);

});
app.use((error, req,res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
        
    });

});

app.listen(port,()=>{
    console.log(`Server running`)
});
