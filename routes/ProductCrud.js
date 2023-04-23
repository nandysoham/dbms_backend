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


const ProductModel = require("../models/ProductModel.js")

env.config({ path: __dirname + '/./../.env' });

const app= express();
app.use(fileupload())



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
const FetchSeller = require("../controller/FetchSeller")


router.post('/createproduct',FetchSeller, upload.array('pictures'), 
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
            let user = await ProductModel.findOne({name : req.body.name})

            if(user){
                return res.status(500).json({
                    "success" :"false",
                    "msg" : "sorry the product name has already been taken"
                })
            }

            let pictures = []

            
            
            if(req.files.length > 0){
                pictures = req.files.map(file =>{
                    return {img : file.filename}
                })
            }
            

            product = await ProductModel.create({
                name: req.body.name,
                description: req.body.description,
                sellerid: req.user.id,
                org_price : req.body.org_price,
                price: req.body.price,
                quantity: req.body.quantity,
                discount : req.body.discount,  
                category : req.body.category,            
                pictures
            })


            res.json({
                success : "true",
                msg : "product added",
                product
            })

        }
        catch(error){
            console.log(error);
        }
    }
)

module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ0MDMxMzYxODA5MTdhMjllNGJkNDgwIiwiYWRtaW4iOiJhZG1pbiIsImVtYWlsIjoibm9yZGljMTZAZ21haWwuY29tIn0sImlhdCI6MTY4MTkyODUwMn0.VeFmI9uBmfAruLdaGLvsl8-Z02-6lS1aMpgIhj79GRo
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ0MDMxMzYxODA5MTdhMjllNGJkNDgwIiwiYWRtaW4iOiJhZG1pbiIsImVtYWlsIjoibm9yZGljMTZAZ21haWwuY29tIn0sImlhdCI6MTY4MTkyODUwMn0.VeFmI9uBmfAruLdaGLvsl8-Z02-6lS1aMpgIhj79GRo.eyJ1c2VyIjp7ImlkIjoiNjQ0MDJlZjFhMGZmOWU1ZTU0N2Y0ODVkIiwiYWRtaW4iOiJhZG1pbiIsImVtYWlsIjoibm9yZGljMTZAZ21haWwuY29tIn0sImlhdCI6MTY4MTkyNzkyMX0.0jDnoyHYsCXtrnlcUuQyps86UgPhYnUUtsrI3cUMy3c