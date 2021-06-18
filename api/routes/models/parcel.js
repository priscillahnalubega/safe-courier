const mongoose = require('mongoose');

const parcelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:String,
    destination:{type:String, required:true},
    
});

module.exports = mongoose.model('Parcel', parcelSchema);