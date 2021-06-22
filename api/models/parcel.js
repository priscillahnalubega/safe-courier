const mongoose = require('mongoose');

const parcelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdOn: new Date(),
    createdBy: String,
    weight: Number,
    pickupLocation: {type:String, required:true},
    destination: {type:String, required:true},
    status: String
   
    
});

module.exports = mongoose.model('Parcel', parcelSchema);
