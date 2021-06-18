const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Destination = require("./models/destination");
const Parcel = require("./models/parcel");

//Handling Get requests to /destinations
router.get("/", (req, res, next) => {
  Destination.find()
    .select("parcel final_location _id")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        destinations: docs.map((doc) => {
          return {
            _id: doc._id,
            parcel: doc.parcel,
            final_location: doc.final_location,
            requests: {
              type: "GET",
              url: "http://localhost:3000/destinations/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Handling post requests to /destinations
router.post("/", (req, res, next) => {
  Parcel.findById(req.body.parcelId)
    .then((parcel) => {
      
      const destination = new Destination({
        _id: mongoose.Types.ObjectId(),
        parcel: req.body.parcelId,
        final_location: req.body.final_location,
      });
      return destination.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "The destination has been added",
        createdDestination: {
          _id: result._id,
          parcel: result.parcel,
          final_location: result.final_location,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/destinations/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//handling GET requests by /:destinationId
  router.get("/:destinationId", (req, res, next) => {
    Destination.findById(req.params.destinationId)
      .exec()
      .then(destination => {
        // I will use this logic for the users can make changes to the destination if the parcel has reached.
        if (!destination){
          return res.status(404).jsonp({
            message: "you cannot change the destination"
          });
        }
        res.status(200).json({
          destination: destination,
          request: {
            type: "GET",
            url: "http://localhost:3000/destinations/",
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      })
  });

  //user can change the destination
  router.patch('/:destinationId', (req,res,next)=>{
    const id = req.params.destinationId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName]= ops.value;
    }
    Parcel.update({_id: id},{$set: updateOps})
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

module.exports = router;
