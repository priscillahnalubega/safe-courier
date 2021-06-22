const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose =require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT

//importing the routes
const parcelRoutes = require('./api/routes/parcels');
const userRoutes = require('./api/routes/users');





//mongoose is a package that works with the database to store data, fetch data ,Connect to the db
mongoose.connect(process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false},
     ()=> console.log('connected to db')
  );

mongoose.Promise =global.Promise;

//morgan is middle ware for automatic logging || bodyParser is a dependency for extracting body requests
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

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
//app.use('/api/v1', router);


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

