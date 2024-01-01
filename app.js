const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const influencer = require('./src/v1/influencer/common/routes/routes');
const merchant = require('./src/v1/merchant/common/routes/routes');
const cors = require('cors');
const database = require('./config/database/database');
const port = process.env.PORT || 8000
const path = require('path');

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/influencer', influencer);
app.use('/merchant',merchant);


database();

app.listen(port,()=>{
    console.log(`Succesfully started express server on port ${port}`);
})

module.exports = app
