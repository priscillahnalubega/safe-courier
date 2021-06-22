const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../Auth/check-auth');

const Parcel = require('../models/parcel');

router.get('/',  (req, res, next)=>{
    Parcel.find()
    .select('name destination _id')
    .exec()
    .then(docs =>{
        const response ={
            count:docs.length,
            parcels:docs.map(doc=>{
                return{
                    name:doc.name,
                    destination:doc.destination,
                    _id:doc._id,
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
        _id: new mongoose.Types.ObjectId(),
        createdBy: req.body.createdBy,
        weight:req.body.weight,
        pickupLocation: req.body.pickupLocation,
        destination: req.body.destination,
    });
    // save is a method provided by mongoose to store data, exec turns it into a promise
    parcel.save()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'the order has been created',
            createdParcel:{
                createdBy: result.createdBy,
                weight : result.weight,
                pickupLocation: result.pickupLocation,
                destination: result.destination,
                _id:result._id,
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
    .select('createdBy  weight pickupLocation destination _id')
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
 

router.get('/users/:userId/:parcelId',(req,res,next)=>{
    const id = req.params.parcelId;
    Parcel.findById(id)
    .select('name  _id')
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
 

router.delete('/:parcelId', (req,res,next)=>{
    const id =req.params.parcelId;
    Parcel.remove({_id:id })
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'Parcel has been deleted',
            request:{
                type:'POST',
                url:'http//localhost:3000/parcels',
                body:{name:'String',destination:'String'}
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
router.patch('/:parcelId', (req,res,next)=>{
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
            message:'Parcel destination has been changed',
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

router.patch('/:parcelId', (req,res,next)=>{
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
            message:'Parcel destination has been changed',
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
router.put('/:parcelId', (req,res,next)=>{
    const id = req.params.parcelId;
    parcel.cancel({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });


});

router.get('/users/:userid/parcels',(req,res,next)=>{
    const id = req.params.parcelId;
    Parcel.findById(id)
    .select('name destination _id')
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
 


    
  


module.exports = router;