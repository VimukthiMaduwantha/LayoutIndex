const LocationModel = require("../Models/Location");

//add locations
const AddLocations = async (req, res) => {
    const {
        locationName,
        locationAddress,
        phone,
        noOfDevices
    } = req.body

    try {
        const createLocation = new LocationModel({
            locationName,
            locationAddress,
            phone,
            noOfDevices
        })
        return await createLocation.save().then((value) => {
            return res.status(200).json({ ID: value._id });
        }).catch((err) => {
            return res.status(500).json({ err });
        })

    } catch (err) {
        return res.status(400).josn({ error: err.message });
    }
}

//get all location details
const GetAllLocationDetails = async (req, res) => {
    try {
        const LocationDetails = await LocationModel.find();
        return res.status(200).send({ LocationDetails });
    } catch (err) {
        return res.status(500).send("Server Error");
    }
}

//delete location details
const DeleteLocationDeatils = async (req, res) => {
    const id = req.params.deleteID;
    await LocationModel.findByIdAndDelete(id).then(() => {
        res.status(200).send({ message: 'Success' });
    }).catch((err) => {
        res.status(400).send({ message: err })
    })
}

//get location details by locationID
const GetLocationDetailsByID = async (req, res) => {
    try {
        const id = req.params.updateRowID;
        const LocationDetails = await LocationModel.find({ _id: id });
        res.status(200).send({ LocationDetails });
    } catch (err) {
        res.status(500).send("Server Error");
    }
}

//update location details
const UpdateLocationDeatils = async (req, res) => {
    const updateID = req.body.updateRowID;
    const {
        locationAddress,
        phone
    } = req.body;

    try {
        const LocationUpdate = {
            locationAddress,
            phone
        }

        await LocationModel.findByIdAndUpdate(updateID, LocationUpdate).then(() => {
            res.status(200).send({ status: 'Success', data: LocationUpdate })
        }).catch((err) => {
            res.status(400).send({ status: err });
        })
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}

//update location device  count by 1
const UpdateDeviceCount = async (req, res) => {
    const locationID = req.body.loactionID;
    const deviceCount = req.body.deviceCount;

    try {
        const deviceCountDetails = {
            noOfDevices: deviceCount
        }
        await LocationModel.findByIdAndUpdate(locationID, deviceCountDetails).then(() => {
            res.status(200).send({ status: 'Success', data: deviceCountDetails })
        }).catch((err) => {
            res.status(400).send({ status: err });
        })
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
}


module.exports = {
    AddLocations,
    GetAllLocationDetails,
    DeleteLocationDeatils,
    GetLocationDetailsByID,
    UpdateLocationDeatils,
    UpdateDeviceCount
}