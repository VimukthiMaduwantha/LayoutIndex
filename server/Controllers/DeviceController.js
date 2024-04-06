const DeviceModel = require('../Models/Device');

//add devices
const AddDevices = async (req, res) => {
    const {
        serial,
        locationName,
        deviceType,
        isActive
    } = req.body;
    const image = req.files.file;

    try {
        const imageNameStore = new Date().getTime();
        await image.mv("Assets/DeviceImages/" + `${imageNameStore}.jpg`, (err) => {
            console.log("An error occured in file ", err);
        })

        const DeviceSave = new DeviceModel({
            serial,
            locationName,
            deviceType,
            isActive,
            image: `${imageNameStore}.jpg`
        })

        return await DeviceSave.save().then((value) => {
            res.status(200).json({ ID: value._id })
        }).catch((err) => {
            res.status(500).json({ err })
        })
    } catch (err) {
        res.status(400).json({ error: err.meassage })
    }
}

//get all device details
const GetAllDeviceDetails = async (req, res) => {
    try {
        const DeviceDetails = await DeviceModel.find();
        return res.status(200).json({ DeviceDetails });
    } catch (err) {
        return res.status(500).send("Server Error");
    }
}
//delete device details
const DeleteLocationDeatils = async (req, res) => {
    const id = req.params.deleteID;
    await DeviceModel.findByIdAndDelete(id).then(() => {
        res.status(200).send({ message: 'Success' });
    }).catch((err) => {
        res.status(400).send({ message: err })
    })
}

//get device details by ID
const GetUpdateDeviceDetailsByID = async (req, res) => {
    try {
        const id = req.params.updateRowID;
        const DeviceDetails = await DeviceModel.find({ _id: id });
        res.status(200).send({ DeviceDetails });
    } catch (err) {
        res.status(500).send("Server Error");
    }
}

//update device details
const UpdateDeviceDetails = async (req, res) => {
    if (!req.body.file) {
        try {
            const image = req.files.file;
            const {
                isActive
            } = req.body;
            const UpdateID = req.body.updateID;

            const imageNameStore = new Date().getTime();
            await image.mv("Assets/DeviceImages/" + `${imageNameStore}.jpg`, (err) => {
            })

            const DeviceUpdate = {
                isActive,
                image: `${imageNameStore}.jpg`
            }
            await DeviceModel.findByIdAndUpdate(UpdateID, DeviceUpdate).then(() => {
                res.status(200).send({ status: 'Success', data: DeviceUpdate });
            }).catch((err) => {
                res.status(400).send({ status: err });
            })
        } catch (err) {
            res.status(400).send({ error: err.message })
        }
    } else {
        const UpdateID = req.body.updateID;
        const {
            file,
            isActive
        } = req.body;

        try {
            const DeviceUpdate = {
                isActive,
                image: file
            }
            await DeviceModel.findByIdAndUpdate(UpdateID, DeviceUpdate).then(() => {
                res.status(200).send({ status: 'Success', data: DeviceUpdate });
            }).catch((err) => {
                res.status(400).send({ status: err });
            })
        } catch (err) {
            res.status(400).send({ error: err.message })
        }

    }

}

module.exports = {
    AddDevices,
    GetAllDeviceDetails,
    DeleteLocationDeatils,
    GetUpdateDeviceDetailsByID,
    UpdateDeviceDetails
}