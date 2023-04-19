const express = require('express');
const cors = require("cors")
const env = require('dotenv');    // for .env running

const mongoose = require('mongoose')

const app = express();


env.config();

app.use(cors())
app.use(express.json())
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))


const CustomerSignupRoutes = require("./routes/CustomerSignup.js")
const SellerSignupRoutes = require("./routes/SellerSignup")
const ProductCrudRoutes = require("./routes/ProductCrud")
const Seller_Product_routesRoutes = require("./routes/Seller_Product_routes")
app.use('/api', CustomerSignupRoutes);
app.use('/api', SellerSignupRoutes);
app.use('/api', ProductCrudRoutes);
app.use('/api', Seller_Product_routesRoutes);

mongoose.connect(
    process.env.MONGOURI,
    
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(()=>{
        console.log("Database connected");
    })
    .catch(err => {
        console.log(err);
        console.log("sorry database cannot be connected ...");
    });


app.listen(process.env.PORT, ()=>{
    console.log(`the server is running on port ${process.env.PORT}`);
})