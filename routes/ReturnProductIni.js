const express = require('express')
const router = express.Router()


const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const env = require("dotenv")
const CustomerModel = require("../models/CustomerModel.js")
const OrderModel = require("../models/OrderModel.js")
const PaymentModel = require("../models/PaymentModel.js")
const FetchUser = require("../controller/FetchUser")
const ReturnModel = require("../models/ReturnModel")
env.config({ path: __dirname + '/./../.env' });

const app= express();


const JWT_SECRET = process.env.JWT_SECRET

router.post('/returnproduct/ini',FetchUser,
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
            let order = await OrderModel.findOne({_id : req.body.orderid})          // this is the actual id of the order model
            if(!order){
                return res.status(404).json({
                    success : "false",
                    msg : "No such order found"
                })
            }

            if(order.type != "order"){
                return res.status(400).json({
                    success : "false",
                    msg : "Order return has been initiated or is being going on"
                })
            }

            let ret = await ReturnModel.create({
                orderid : order._id,
                netorderid : order.orderid,
                sellerid : order.sellerid,
                userid : order.userid,
                productid : order.productid,
                quantity : order.quantity,
                payment : order.payment,
                status : "registered",
                dayofpurchase : order.createdAt,
                accountid : req.body.accountid

            })
            
            res.json({
                success : "true",
                msg : "Return initiated",
                ret
    
            })

        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success : "false",
                msg : "internal server error"
            })
        }
    }
)

module.exports = router;

