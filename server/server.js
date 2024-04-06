const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
require("dotenv").config();
const fileUpload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 8000;
app.use("/Assets", express.static(__dirname + "/Assets"));

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
const url = process.env.MONGODB_URL;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("MongoDB Connected!!");
});

app.listen(port, () => {
    console.log("PORT connected on " + port);
})


//Locations
const Locations = require('./Routes/LocationRoutes');
app.use('/locations', Locations);

//Devices
const Device = require('./Routes/DeviceRoutes');
app.use('/Devices', Device)



// user name :maduwanthavimukthi pw: joOzKlQGIrSyWqaC
// user name :maduwanthavimukthi pwnew: T3vzNjWCvv21YP5Q