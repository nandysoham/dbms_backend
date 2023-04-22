/**
 * middleware for getiing user details
 */
 const jwt = require('jsonwebtoken');
 const env = require('dotenv')
 env.config({ path: __dirname + '/./../.env' })
 
 
 const FetchUser = async (req, res, next)=>{
     const token = req.header("auth-token")
     if(!token){
         res.status(401).json({
             success : "false",
             msg : "please authenticate first"
         })
     }
     const JWT_SECRET = process.env.JWT_SECRET;
 
     try{
         const data = await jwt.verify(token, JWT_SECRET);
         req.user = data.user
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
 
 module.exports = FetchUser;
 