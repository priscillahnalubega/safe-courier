const mongoose = require('mongoose');

const parcelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //createdOn: new Date(),
    createdBy: String,
    weight: Number,
    pickupLocation: {Type:String, required:True},
    destination: {Type:String, required:True},
    status: String
   
    
});

module.exports = mongoose.model('Parcel', parcelSchema);
