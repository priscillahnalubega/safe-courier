const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./models/user');

//handling post requests to / users
router.post('/signup', (req, res, next)=>{
    User.find({email: req.body.email})
    .exec()
    .then( user =>{
        if(user.length>= 1){
            return res.status(409).json({
                message:"email exists"
            });
        } else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if (err){
                    return res.status(500).json({
                        error:err
                    });
                }else{
                    const user = new User ({
                        _id: new mongoose.Types.ObjectId(),
                        userName:req.body.userName,
                        email: req.body.email,
                        password: hash
                        });
                        user
                        .save()
                        .then(result =>{
                            console.log(result);
                            res.status(201).json({
                                message:'User created',
                                
                            });
                        })
                        .catch( err=>{
                            console.log(err);
                            res.status(500).json({
                                error:err
                            });
                        });
                }
              
              }); 
        }
    })
    
   
});
// Logining in Users
router.post('/login',(req, res, next)=>{
User.find({ email: req.body.email})
.exec()
.then( user =>{
if (user.length < 1){
  return   res.status(401).json({
message:"Auth failed"
    });
}
bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
    if (err){
        return   res.status(401).json({
            message:"Auth failed"
                });  
    }
    if (result){
     const token =   jwt.sign({
            email:user[0].email, 
            userId:user[0]._id
        }, 
        process.env.JWT_KEY,
        {
            expiresIn: "1h"
        }

        );
        return res.status(200).json({
            message:"Auth sucessful",
            token:token
        })
    }
    res.status(401).json({
        message:"Auth failed"
    });
});

})
.catch();
});

// get all users
router.get('/',  (req, res, next)=>{
    User.find()
    .select('_id userName')
    .exec()
    .then(docs =>{
        const response ={
            count:docs.length,
            users:docs.map(doc=>{
                return{
                    _id:doc._id,
                    userName:doc.userName,
                     request:{
                        type:"GET",
                        url:'http://localhost:3000/users/' + doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
     })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

router.get('/:userId',(req,res,next)=>{
    const id = req.params.userId;
    User.findById(id)
    .select(' _id userName')
    .exec()
    .then(doc=>{
        console.log("from database",doc);
        if(doc){
            res.status(200).json({
                parcel:doc,
                request:{
                    type:'GET',
                    description:'Get all users',
                    url: 'http://localhost/users'
                }
            });
        }else{
            res.status(404).json({message:'No valid entry for provided ID'});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err});
    });
});
 


// handling delete requests to /users

router.delete('/:userId',(req, res,next)=>{
    User.remove({_id:req.params.userId})
    .exec()
    .then( result => {
        res.status(200).json({
            message:"User deleted"
        });
    })
    .catch( err =>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});


module.exports = router;