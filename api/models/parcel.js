const mongoose = require('mongoose');

const parcelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdOn: new Date(),
    createdBy: String,
    weight: Number,
    pickupLocation: {Type:String, required:true},
    destination: {Type:String, required:true},
    status: String
   
    
});

module.exports = mongoose.model('Parcel', parcelSchema);
