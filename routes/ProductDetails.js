const express = require('express')
const router = express.Router()
const path = require('path')
const { body, validationResult } = require('express-validator');

const env = require('dotenv')
env.config({ path: __dirname + '/./../.env' });

const app= express();
const ProductModel = require("../models/ProductModel")
const CartModel = require("../models/CartModel")

router.post('/getproduct',
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
            let product = await ProductModel.findOne({_id : req.body.productid})
            return res.status(200).json({
                success : "true",
                msg : "product",
                product
            })

        }
        catch(error){
            console.log(error);
        }
    }
)
module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ0MTdkODZlYTgyOTZjMTIyNzlkYjVkIiwiZW1haWwiOiJuYW5keUBnbWFpbC5jb20ifSwiaWF0IjoxNjgyMDEzNTc0fQ.6B5kjPClcgglolwx-ABCEQcWz1ganfsPuWgwSZsVsQg
