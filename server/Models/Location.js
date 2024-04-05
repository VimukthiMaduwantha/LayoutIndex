const mongoose = require('mongoose');
const { Schema } = mongoose;

const LocationModel = new Schema(
    {
        locationName: {
            type: String,
            required: true
        },
        locationAddress: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        noOfDevices: {
            type: Number,
            required: true
        },
    }
)

const Location = mongoose.model("Locations", LocationModel);
module.exports = Location;