const express = require('express');
const router = express.Router();

const checkAuth = require('../Auth/check-auth');
const {authstatus, authCurrent_location}=require ('../middlewares')

const Parcel = require('./models/parcel');
const user = require('./models/user');
const User = require('./models/user');

router.get('/',  (req, res, next)=>{
    Parcel.find()
    .select('name location _id user')
    .exec()
    .then(docs =>{
        const response ={
            count:docs.length,
            parcels:docs.map(doc=>{
                return{
                    name:doc.name,
                    location:doc.location,
                    _id:doc._id,
                    user:doc.user,
                    request:{
                        type:"GET",
                        url:'http://localhost:3000/parcels/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
     })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});


router.post('/',  (req, res, next)=>{
  const parcel = new Parcel({
        _id:new mongoose.Types.ObjectId(),
        name : req.body.name,
        location: req.body.location,
        user:doc.user
    });
    // save is a method provided by mongoose to store data, exec turns it into a promise
    parcel.save()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'the order has been created',
            createdParcel:{
                name:result.name,
                location:result.location,
                _id:result._id,
                user:user,
                request:{
                    type:"GET",
                    url:'http://localhost:3000/parcels/' + result._id
                }
            }
        });
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
   
});
   
    
router.get('/:parcelId',(req,res,next)=>{
    const id = req.params.parcelId;
    Parcel.findById(id)
    .select('name location _id user')
    .exec()
    .then(doc=>{
        console.log("from database",doc);
        if(doc){
            res.status(200).json({
                parcel:doc,
                request:{
                    type:'GET',
                    description:'Get all parcels',
                    url: 'http://localhost/parcels'
                }
            });
        }else{
            res.status(404).json({message:'No valid entry for provided ID'});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
});
 
router.patch('/:parcelid/status', (req,res,next)=>{
    const id = req.params.parcelId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName]= ops.value;
    }
    Parcel.updateOne({_id: id},{$set: updateOps})
    .exec()
    .then( result =>{
        console.log(result);
        res.status(200).json({
            message:'Parcel delivery status has been changed',
            request:{
                type:'GET',
                url:'http://localhost:3000/parcels/'+ id
            }
        });
    })
   .catch(err =>{
console.log(err);
        res.status(500).json({
          error:err
  
        });
    });

});




router.delete('/:parcelId', (req,res,next)=>{
    const id =req.params.parcelId;
    Parcel.remove({_id:id })
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'Parcel has been cancelled',
            request:{
                type:'POST',
                url:'http//localhost:3000/parcels',
                body:{name:'String',location:'String' }
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });

});






module.exports = router;