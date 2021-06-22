const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    try{
        const token = req.authorization;
        console.log(token)
    const decoded = jwt.verify(token,process.env.JWT_KEY);
    req.userDate = decoded;
    next();
}catch(error){
    return res.status(401).json({
        message:' Auth failed'
    })
}

};