const express = require('express');
const DeviceController = require('../Controllers/DeviceController');

const DeviceRoutes = express.Router();

//create device
DeviceRoutes.post('/saveDeviceDetails', DeviceController.AddDevices);

//get all device details
DeviceRoutes.get('/getAllDeviceDetails', DeviceController.GetAllDeviceDetails);

//delete device details
DeviceRoutes.delete('/deleteDeviceDetails/:deleteID', DeviceController.DeleteLocationDeatils);

//get update device details
DeviceRoutes.get('/getUpdateDeviceDetailsByID/:updateRowID', DeviceController.GetUpdateDeviceDetailsByID);

//update device details
DeviceRoutes.put('/updateDeviceDetail', DeviceController.UpdateDeviceDetails);



module.exports = DeviceRoutes;