const authPage = (req,res,next)=>{
    return(req,res,next)=>{
     const   userRole =req.body.role
     if (permissions.includes(userRole)){
         next()
     }else{
         return res.status(401).json({
             message:"You are not authorized"
         })
     }
    }
};
const authStatus=(permisions)=>{};
module.express ={authPage, authStatus};