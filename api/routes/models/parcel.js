const mongoose = require('mongoose');

const parcelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:String,
    location:{type:String, required:true},
    user:[{type: mongoose.Schema.Types.ObjectId, ref:'User', required :true}]
    
});

module.exports = mongoose.model('Parcel', parcelSchema);