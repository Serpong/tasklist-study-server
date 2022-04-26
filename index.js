const express = require('express');
const app = express();
const mongoose = require('mongoose');


require('dotenv').config();

// global middlewares
app.use(require('cookie-parser')());
app.use(express.json());
app.use(require('./middlewares/authMiddleware').verifyTokenMW);


// DB
mongoose.connect(process.env.DB_ADDR)
	.then(()=>console.log("DB CONNECTED"))
	.catch( e => console.log(e));


app.set('appPath', __dirname);

app.use('/', require('./routes')(express.Router()));
app.listen(3000, ()=>console.log("SERVER STARTED"));