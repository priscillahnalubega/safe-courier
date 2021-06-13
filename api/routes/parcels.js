const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Parcel = require('./models/parcel');

router.get('/', (req, res, next)=>{
    Parcel.find()
    .exec()
    .then(docs =>{
        console.log(docs);
        res.status(200).json(docs);
     })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});


router.post('/', (req, res, next) => {
   
    const parcel = new Parcel({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        destination:req.body.destination
    });
    parcel
      .save()
      .then(result=>{
        console.log(result);
        res.status(201).json({
            message:"Handling Post requests to /parcels",
            createdParcel:result
        })
    })
    .catch(err =>{ 
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
   
});
router.get('/:parcelId',(req,res,next)=>{
  const id = req.params.parcelId;
  Parcel.findById(id)
     .exec()
     .then(doc=>{
         console.log("From database", doc);
         if(doc){
            res.status(200).json(doc);
         } else{
             res.status(404).json({
                 message:"No valid entry found for provided ID"
             })
            }
        
     })
     .catch(err => console.log(err=>{
         console.log(err);
         res.status(500).json({error:error});
     }));
});



router.delete('/:parcelId', (req,res,next)=>{
    const id =req.params.parcelId;
    Parcel.remove({_id:id })
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
router.patch('/:parcelId', (req,res,next)=>{
    const id = req.params.parcelId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName]= ops.value;
    }
    parcel.update({_id: id},{$set: updateOps})
    .exec()
    .then( result =>{
        console.log(result);
        res.status(200).json({result});
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


module.exports = router;