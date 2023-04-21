const express = require('express')
const router = express.Router()
const path = require('path')
const { body, validationResult } = require('express-validator');

const env = require('dotenv')
env.config({ path: __dirname + '/./../.env' });

const app= express();
const FetchUser = require("../controller/FetchUser")
const CartModel = require("../models/CartModel")

// to add each product by quantity 1
router.post('/addtocart',FetchUser, 
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
            let cart = await CartModel.findOne({productid : req.body.productid})
            
            if(cart){
                let qty = parseInt(cart.quantity);
                qty = qty + 1;
                cart.quantity = qty.toString();
                let newcart = await CartModel.findByIdAndUpdate(cart._id, { $set: cart }, { new: true });


                return res.status(200).json({
                    "success" :"true",
                    "msg" : "quantity increased by 1",
                    newcart
                })
            }

            cart = await CartModel.create({
                productid: req.body.productid,
                userid : req.body.userid,
                quantity : "1"
            })


            res.json({
                success : "true",
                msg : "product added",
                cart
            })

        }
        catch(error){
            console.log(error);
        }
    }
)

router.post('/removeonefromcart',FetchUser, 
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
            let cart = await CartModel.findOne({productid : req.body.productid})
            
            if(cart){
                let qty = parseInt(cart.quantity);
                qty = qty - 1;
                let newcart = {}
                if(qty > 0){
                    cart.quantity = qty.toString();
                    newcart = await CartModel.findByIdAndUpdate(cart._id, { $set: cart }, { new: true });

                }
                else{
                    newcart = await CartModel.findByIdAndRemove(cart._id)
                }
                return res.status(200).json({
                    "success" :"true",
                    "msg" : "quantity decrease by 1",
                    newcart
                })
            }

            return res.status(200).json({
                "success" :"true",
                "msg" : "Cart doesnot have the item",
            })

        }
        catch(error){
            console.log(error);
        }
    }
)


router.post('/removeallfromcart',FetchUser, 
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
            let cart = await CartModel.findOne({productid : req.body.productid})
            
            if(cart){
                newcart = await CartModel.findByIdAndRemove(cart._id)
                return res.status(200).json({
                    "success" :"true",
                    "msg" : "item deleted",
                    
                })
            }

            return res.status(200).json({
                "success" :"true",
                "msg" : "Cart doesnot have the item",
            })

        }
        catch(error){
            console.log(error);
        }
    }
)


module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ0MTdkODZlYTgyOTZjMTIyNzlkYjVkIiwiZW1haWwiOiJuYW5keUBnbWFpbC5jb20ifSwiaWF0IjoxNjgyMDEzNTc0fQ.6B5kjPClcgglolwx-ABCEQcWz1ganfsPuWgwSZsVsQg
