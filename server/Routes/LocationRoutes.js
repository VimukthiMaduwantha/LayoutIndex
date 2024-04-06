const express = require('express');
const LocationController = require('../Controllers/LocationController');

const LocationRoutes = express.Router();

//create locations
LocationRoutes.post('/addLocations', LocationController.AddLocations);

//get all location details
LocationRoutes.get('/getLocationDetails', LocationController.GetAllLocationDetails);

//delete location details
LocationRoutes.delete('/deleteLocationDetails/:deleteID', LocationController.DeleteLocationDeatils);

//get location details by locationID
LocationRoutes.get('/getLocationDetailsByID/:updateRowID', LocationController.GetLocationDetailsByID);

//update Location details
LocationRoutes.put('/updateLocationDetails', LocationController.UpdateLocationDeatils);

//update location device  count by 1
LocationRoutes.put('/updateLocationDeviceCount', LocationController.UpdateDeviceCount);



module.exports = LocationRoutes;