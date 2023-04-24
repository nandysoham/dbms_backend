const express = require('express')
const router = express.Router()
const path = require('path')
const { body, validationResult } = require('express-validator');

const env = require('dotenv')
env.config({ path: __dirname + '/./../.env' });

const app= express();
const FetchSeller = require("../controller/FetchSeller")
const OrderModel = require("../models/OrderModel")

// to add each product by quantity 1
router.post('/seller/showorders',FetchSeller, 
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
            let orders = await OrderModel.find({sellerid : req.user.id,  status : "paid"}).sort({updatedAt : -1})
            
            if(orders.length){
                
                return res.status(200).json({
                    "success" :"true",
                    "msg" : "order found and attached",
                    orders
                })
            }

            res.json({
                success : "false",
                msg : "order not found",
                
            })

        }
        catch(error){
            console.log(error);
        }
    }
)

module.exports = router;