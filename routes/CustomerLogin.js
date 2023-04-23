const express = require('express')
const router = express.Router()


const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const env = require("dotenv")
const CustomerModel = require("../models/CustomerModel.js")
env.config({ path: __dirname + '/./../.env' });
const app= express();




const JWT_SECRET = process.env.JWT_SECRET

router.post('/customer/login',
    async (req, res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: "false",
                msg: errors.array() });
        }
        

        // someone trying to post an authorised request
        
        const signtoken = req.headers.signtoken 
        if(!signtoken){
            return res.status(401).json({
                success:"false",
                msg: "forbidden request"
            })
        }
        
        if(signtoken != process.env.SIGNTOKEN){
            return res.status(401).json({
                success:"false",
                msg: "forbidden request"
            })
        }



        try{
            let user = await CustomerModel.findOne({email : req.body.email})
            if(!user){
                return res.status(404).json({
                    success : "false",
                    msg : "No such user found"
                })
            }
            const passCompare = await bcrypt.compare(req.body.password, user.password)
            if (!passCompare) {
                return res.status(400).json({ success:"false",error: " Please enter correct credentials" })
            }
            
            const data = {
                user: {
                    id: user.id,
                    picture : user.profilePicture.img
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET)
            res.json({
                success : "true",
                msg : "Welcome to the Nordic Stores",
                authtoken,
                user
            })

        }
        catch(error){
            console.log(error);
        }
    }
)

module.exports = router;

