const mongoose = require('mongoose');
const { Schema } = mongoose;

const DeviceModel = new Schema(
    {
        serial: {
            type: String,
            required: true
        },
        locationName: {
            type: String,
            required: true
        },
        deviceType: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        createdDate: {
            type: Date,
            default: Date.now
        }
    }
)

const Devices = mongoose.model("Devices", DeviceModel);
module.exports = Devices;