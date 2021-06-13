const express = require('express');
const app = express('');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');

const parcelRoutes = require('./api/routes/parcels');
const destinationRoutes = require('./api/routes/destination');

mongoose.connect('process.env.mongodb+srv://safe-user:safe1234@safe-courier.xq25p.mongodb.net/safe-courier?retryWrites=true&w=majority',{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    }
)


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header('Acess-Control-Allow-Origin', '*');
    res.header('Acess-Control-Allow-Headers', 'Origin, X-Requested-with, Content-type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Acess-Control-Allow-methods', 'PUT, POST, PATCH,DELETE,GET');
        return res.status(200).json({

        });
    }
    next();
});

app.use('/parcels', parcelRoutes );
app.use('/destination',destinationRoutes);

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