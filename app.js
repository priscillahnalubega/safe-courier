const http = require('http');


const port = process.env.PORT || 3000;

const server = http.createServer(app);
server.listen(port);

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');

//importing the routes
const parcelRoutes = require('./api/routes/parcels');
const userRoutes = require('./api/routes/users');
const destinationRoutes =require('./api/routes/destinations');


//mongoose is a package that works with the database to store data, fetch data 
mongoose.connect('process.env.mongodb+srv://restful-app:restful-app@safe-courier.mgeho.mongodb.net/safe-courier?retryWrites=true&w=majority',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    }
)

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



module.exports = app;