const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Importing routes
const authRoute = require('./routes/auth');
const prodRoute = require('./routes/product');
const catRoute = require('./routes/category');

dotenv.config();
//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true}, () => console.log('connected to DB'));


app.use(express.json())
app.use('/api/user', authRoute);
app.use('/api/product', prodRoute);
app.use('/api/category', catRoute);

const port = 4000;
app.listen(port, ()=> console.log("Server listening in port "+port))