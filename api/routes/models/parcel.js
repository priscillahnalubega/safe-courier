const mongoose = require('mongoose');

const parcelSchema=mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:String,
    destination:String
});

module.exports = mongoose.model('Parcel', parcelSchema);