const express = require('express')
const router = express.Router()
const env = require("dotenv")

const { body, validationResult } = require('express-validator');

const Seller_Product_Model = require("../models/Seller_Product_Model.js")

env.config({ path: __dirname + '/./../.env' });

const app= express();


const JWT_SECRET = process.env.JWT_SECRET
const FetchSeller = require("../controller/FetchSeller")


router.post('/create_seller_product',FetchSeller, 
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
            let product_toadd = await Seller_Product_Model.findOne({sellerid : req.user.id, productid : req.body.productid})

            if(product_toadd){
                return res.status(500).json({
                    "success" :"false",
                    "msg" : "sorry you have already added the product consider changing the details instaed"
                })
            }

            
            console.log(req.body)
            product_toadd = await Seller_Product_Model.create({
                sellerid: req.user.id,
                productid: req.body.productid,
                quantity: req.body.quantity, 
                price : req.body.price,
                discount : req.body.discount
            })


            res.json({
                success : "true",
                msg : "product - Seller pair added"
            })

        }
        catch(error){
            console.log(error);
        }
    }
)

module.exports = router;

