require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const router=require("./Routes/user")
const mongoose=require("mongoose")
const cookieParser = require("cookie-parser");



connection();
app.use(cookieParser());
app.use(express.json());
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
    }
));



const products = require('./Routes/ProductRoute');
const user = require('./Routes/user');
app.use("/api",user)

app.use('/api',products);


const cartRoutes = require('./Routes/cardRoutes');


app.use('/api', cartRoutes);



const port = process.env.PORT || 8000;
app.listen(port, console.log(`Listening on port ${port}...`));