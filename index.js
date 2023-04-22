const express = require('express');
const cors = require("cors")
const env = require('dotenv');    // for .env running

const mongoose = require('mongoose')

const app = express();
const sqlite3 = require('sqlite3').verbose();

env.config();

app.use(cors())
app.use(express.json())
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))


const CustomerSignupRoutes = require("./routes/CustomerSignup.js")
const SellerSignupRoutes = require("./routes/SellerSignup")
const ProductCrudRoutes = require("./routes/ProductCrud")
const CartCrudRoutes = require("./routes/CartCrud")
const CreateOrderRoutes = require("./routes/CreateOrder")
const MakePaymentRoutes = require("./routes/MakePayment")
const UpdateDeliveryRoutes = require("./routes/UpdateDelivery")
const ShowDeliveryRoutes = require("./routes/ShowDelivery")
const CustomerLoginRoutes = require("./routes/CustomerLogin")
const SellerLoginRoutes = require("./routes/SellerLogin")
const CustomerPublicRoutes = require("./routes/CustomerPublicDetails")
const SellerPublicRoutes = require("./routes/SellerPublicDetails")
app.use('/api', CustomerSignupRoutes);
app.use('/api', SellerSignupRoutes);
app.use('/api', ProductCrudRoutes);
app.use('/api', CartCrudRoutes);
app.use('/api', CreateOrderRoutes);
app.use('/api', MakePaymentRoutes);
app.use('/api', UpdateDeliveryRoutes);
app.use('/api', ShowDeliveryRoutes);
app.use('/api', CustomerLoginRoutes)
app.use('/api', SellerLoginRoutes)
app.use("/api", CustomerPublicRoutes)
app.use("/api", SellerPublicRoutes)

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


let db = new sqlite3.Database('./db/sample.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
    });    


app.listen(process.env.PORT, ()=>{
    console.log(`the server is running on port ${process.env.PORT}`);
})