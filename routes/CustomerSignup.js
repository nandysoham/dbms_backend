const express = require('express')
const router = express.Router()
const multer = require('multer')  // multer is imported here
const shortid = require('shortid')
const path = require('path')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fileupload = require("express-fileupload");
const env = require("dotenv")
const randomstring = require("randomstring");

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


const CustomerModel = require("../models/CustomerModel.js")

env.config({ path: __dirname + '/./../.env' });

const app= express();
app.use(fileupload())



// const Mailer = require("../controller/Mailer")
// const Usermodel = require("../models/Usermodel")




// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(path.dirname(__dirname), '/UserUploads'))
//     },
//     filename: function (req, file, cb) {
//         cb(null, shortid.generate() + '-' + file.originalname)  // file.originalname is the property by multer which can be seen from postman
//     }
// })

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Nordic_stores',
      format: async (req, file) => 'png', // supports promises as well
      public_id: (req, file) => shortid.generate() + '-' + file.originalname,
    },
  });

var upload = multer({ storage: storage })


const JWT_SECRET = process.env.JWT_SECRET

router.post('/createuser', upload.single('profilePicture'), 
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

            if(user){
                return res.status(500).json({
                    "success" :"false",
                    "msg" : "sorry the user already exist"
                })
            }

            // console.log(req.body.password)
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt)
            let profilePicture = {};

            
            
            if(req.file){
                
                profilePicture = {
                    img : req.file.filename
                }
            }
            // generating verification string

            var verifytoken = randomstring.generate({
                length: 20,
                charset: 'alphabetic'
            })

            user = await CustomerModel.create({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                pincode: req.body.pincode,
                password: secPass,
                profilePicture
            })


            const data = {
                user: {
                    id: user.id,
                    admin: user.admin,
                    email: user.email,
                }
            }


            const authtoken = jwt.sign(data, JWT_SECRET)

            res.json({
                success : "true",
                msg : "Welcome to the Nordic Stores",
                authtoken
            })

        }
        catch(error){
            console.log(error);
        }
    }
)

module.exports = router;

