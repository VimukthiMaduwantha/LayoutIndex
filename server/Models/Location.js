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
        createdDate: {
            type: Date,
            default: Date.now
        }
    }
)

const Location = mongoose.model("Locations", LocationModel);
module.exports = Location;