const express = require('express');
const app = express();
const mongoose = require('mongoose');


require('dotenv').config();

// global middlewares
app.use(require('cookie-parser')());
app.use(express.json());


// DB
mongoose.connect(process.env.DB_ADDR)
	.then(()=>console.log("DB CONNECTED"))
	.catch( e => console.log(e));



app.use('/', require('./routes')(express.Router()));
app.listen(3000, ()=>console.log("SERVER STARTED"));