const express = require('express')
const router = express.Router()


const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require("path")
const env = require("dotenv")
const CustomerModel = require("../models/CustomerModel.js")
const OrderModel = require("../models/OrderModel.js")
const PaymentModel = require("../models/PaymentModel.js")
const FetchUser = require("../controller/FetchUser")
const FetchSeller = require("../controller/FetchSeller")
const ReturnModel = require("../models/ReturnModel")
env.config({ path: __dirname + '/./../.env' });


const { AsyncDatabase } = require("promised-sqlite3");
const DeliveryModel = require('../models/DeliveryModel.js');
const sqlite3 = require("sqlite3").verbose();

const app= express();


const JWT_SECRET = process.env.JWT_SECRET

router.post('/returnproduct/confirm',FetchSeller,
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
        
            let ret = await ReturnModel.findById(req.body.retid)          // this is the actual id of the order model
            if(!ret){
                return res.status(404).json({
                    success : "false",
                    msg : "No such return order found"
                })
            }


            ret.status ="approved"
            let newret = await ReturnModel.findByIdAndUpdate(ret._id, {$set : ret}, {new: true});
            

            // now credit the account of the user
            const db = await AsyncDatabase.open(path.resolve(__dirname, "../db/sample.db"));
            const account = await db.get("SELECT * FROM Bank WHERE ID = ?", ret.accountid );


            console.log("before the transaction Amt ", account.AMOUNT)
            if(account){
                const new_amt = parseInt(account.AMOUNT) + parseInt(ret.payment)
                console.log(new_amt)
                const uptaccount = await db.exec(`
                    UPDATE Bank 
                    SET AMOUNT = ?
                    WHERE ID =?
                `, [new_amt.toString(), ret.accountid.toString()])

                console.log("after transaction")
            }
            else{
                return res.status(404).json({
                    success : "false",
                    msg : "Account number was incorrect"
                })
            }

            // now send a message to the delivery guy about the return of the package
            const put_delivery = await DeliveryModel.create({
                orderid : ret.netorderid,
                individ : ret.orderid,
                type : "return",
                comment : "Order return details accepted by the Seller",
                address1 :  "TBD",
                address2 : "TBD",
                city : "TBD",
                state : "TBD",
                country : "TBD",
                pincode : "TBD",
                phone : "TBD"
            })

            res.json({
                success : "true",
                msg : "Return Done Account has been credited ",
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

