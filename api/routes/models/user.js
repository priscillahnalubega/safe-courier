const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    userName: String,
    email:{
        type: String, 
        required: true,
        match:/\S+@\S+\.\S+/
    },
    password:{type: String, required:true }
    
});

module.exports = mongoose.model('User', userSchema);