const mongoose = require('mongoose');

const destinationSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    final_location: {type: String, required: true},
    parcel:[{type: mongoose.Schema.Types.ObjectId, ref:'Parcel', required :true}]
    
});

module.exports = mongoose.model('Destination', destinationSchema);