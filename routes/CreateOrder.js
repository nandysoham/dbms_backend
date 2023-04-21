const express = require('express')
const router = express.Router()
const path = require('path')
const { body, validationResult } = require('express-validator');
const randomstring = require("randomstring");
const env = require('dotenv')
env.config({ path: __dirname + '/./../.env' });

const app= express();
const FetchUser = require("../controller/FetchUser")
const CartModel = require("../models/CartModel")
const CreateOrder = require("../controller/CreateOrder")
const UserModel = require("../models/CustomerModel")
const SellerModel = require("../models/SellerModel")
const ProductModel = require("../models/ProductModel")
const OrderModel = require("../models/OrderModel")
const PaymentModel = require("../models/PaymentModel")
// to add each product by quantity 1
router.post('/createorder',FetchUser, 
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
            let cart = await CartModel.find({userid : req.user.id})            
            let total_amount = 0;
            if(cart){
                let user = await UserModel.findOne({_id : req.user.id})
                let final_part = []
                console.log(cart);
                var orderid = randomstring.generate({
                    length: 30,
                    charset: 'alphabetic'
                })
                // await iterators
                for await (obj of cart){
                    
                    let product = await ProductModel.findOne({_id : obj.productid})
                    let seller = await SellerModel.findOne({_id : product.sellerid})
                    let this_amount = parseInt(product.price)*parseInt(obj.quantity);
                    let tosend = {
                        productid : obj.productid,
                        sellerid : seller._id,
                        orderid: orderid,
                        userid : req.user.id,
                        quantity : obj.quantity,
                        email : user.email,
                        phone : user.phone,
                        address1 : user.address1,
                        address2 : user.address2,
                        city : user.city,
                        state : user.state,
                        country : user.country,
                        pincode : user.pincode,
                        payment : this_amount.toString(),
                        type : "order",
                        status : "unpaid"
                    }

                    let order = await OrderModel.create(tosend)
                    final_part.push(tosend)    
                    total_amount += this_amount;
                };
                
                const pay = PaymentModel.create({
                    amount : total_amount,
                    orderid : orderid,
                    userid : req.user.id,
                })

                
                return res.status(200).json({
                    final_part,
                    total_amount,
                    orderid
                })
            }

        }
        catch(error){
            console.log(error);
        }
    }
)


module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ0MTdkODZlYTgyOTZjMTIyNzlkYjVkIiwiZW1haWwiOiJuYW5keUBnbWFpbC5jb20ifSwiaWF0IjoxNjgyMDEzNTc0fQ.6B5kjPClcgglolwx-ABCEQcWz1ganfsPuWgwSZsVsQg
