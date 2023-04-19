/**
 * middleware for getiing user details
 */
 const jwt = require('jsonwebtoken');
 const env = require('dotenv')
 env.config({ path: __dirname + '/./../.env' })
 
 
 const FetchSeller = (req, res, next)=>{
     const token = req.header("auth-token")
     if(!token){
         res.status(401).json({
             success : "false",
             msg : "please authenticate first"
         })
     }
     const JWT_SECRET = process.env.JWT_SECRET;
 
     try{
         const data = jwt.verify(token, JWT_SECRET);
         req.user = data.user
         console.log(data)
         
         if(data.user.admin != 'admin'){
             res.status(400).json({
                 success: "false",
                 msg: "please enter through a valid seller account"
             })
         }
         next()
     }
     catch(error){
         console.log(error);
         res.status(500).json({
             success : "false",
             msg : "internal server error"
         })
     }
 }
 
 module.exports = FetchSeller;
 