const express = require('express')
const router = express.Router()
const path = require('path')
const { body, validationResult } = require('express-validator');

const env = require('dotenv')
env.config({ path: __dirname + '/./../.env' });

const app= express();
const FetchSeller = require("../controller/FetchSeller")
const SellerModel = require("../models/SellerModel")

// to add each product by quantity 1
router.post('/seller/getprivatedetails',FetchSeller, 
    async (req, res) =>{

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
            let user = await SellerModel.findOne({_id : req.user.id})
            
            if(user){
                
                return res.status(200).json({
                    "success" :"true",
                    "msg" : "user found and attached",
                    user
                })
            }

            res.json({
                success : "false",
                msg : "person not found",
                
            })

        }
        catch(error){
            console.log(error);
        }
    }
)

router.get('/seller/getpublicdetails',
    async (req, res) =>{

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


        const {userid} = req.body;
        try{
            let user = await SellerModel.findOne({_id : userid}).select(['-password'])
            
            if(user){
                
                return res.status(200).json({
                    "success" :"true",
                    "msg" : "user found and attached",
                    user
                })
            }

            res.json({
                success : "false",
                msg : "person not found",
                
            })

        }
        catch(error){
            console.log(error);
        }
    }
)
module.exports = router;
