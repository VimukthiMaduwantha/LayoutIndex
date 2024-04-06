import { Box, Button, Card, CardHeader, Chip, Container, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, Switch, TextField, Tooltip, Typography, styled } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Formik } from 'formik'
import * as Yup from "yup";
import axios, { Axios } from 'axios';
import { toast } from 'react-toastify';
import CancelIcon from '@mui/icons-material/Cancel';

function AddEditDevice({ deviceDialog, setDeviceDialog, updateRowID, setUpdateRowID }) {
    const inputRef = useRef(null);
    const [deviceData, setDeviceData] = useState({
        serial: 0,
        locationName: '',
        deviceType: '',
        isActive: false
    })
    const [serialNo, setSerialNo] = useState(0);
    const [allLocationDetails, setAllLocationDetails] = useState([]);
    const [deviceCount, setDeviceCount] = useState();
    const [imageUpload, setImageUpload] = useState();
    const [imageView, setImageView] = useState();
    const [loactionID, setLocationID] = useState();
    const [isUpdate, setIsUpdate] = useState(false);
    const [updateID, setUpdateID] = useState();
    const [isImageUploadEnable, setIsImageUploadEnable] = useState(false);
    const [isImageUpload, setIsImageUpload] = useState(false);

    useEffect(() => {
        GetLocationsDetails();
    }, [])

    useEffect(() => {
        if (!deviceDialog) {
            GetLocationsDetails();
        }
    }, [deviceDialog])

    useEffect(() => {
        if (updateRowID) {
            GetUpdateDeviceDetails();
        }
    }, [updateRowID])

    useEffect(() => {
        if (deviceData.locationName) {
            GetTheTotalNoOfDevices();
        }
    }, [deviceData.locationName])

    useEffect(() => {
        if (!isUpdate && deviceData.locationName) {
            GetSerialNo();
        }
    }, [deviceData.locationName])

    function handleClose() {
        setDeviceDialog(false);
        setDeviceData({
            ...deviceData,
            serial: 0,
            locationName: '',
            deviceType: '',
            isActive: false
        })
        removeImage();
        setSerialNo(0);
        setUpdateID();
        setUpdateRowID();
        setIsUpdate(false);
        setIsImageUploadEnable(false);
    }

    function handleChange(e) {
        const target = e.target;
        const value = target.value;
        setDeviceData({
            ...deviceData,
            [e.target.name]: value
        })
    }

    function GetSerialNo() {
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().slice(-2);
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const date = currentDate.getDate().toString().padStart(2, '0');
        const hour = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const deviceSerialNO = `${year}${month}${date}${hour}${minutes}${seconds}`;
        setSerialNo(deviceSerialNO);
    }

    function GetLocationsDetails() {
        axios.get('http://localhost:8000/locations/getLocationDetails').then((res => {
            if (res.data.LocationDetails.length > 0) {
                setAllLocationDetails(res.data.LocationDetails);
            }
        }))
    }

    function GetTheTotalNoOfDevices() {
        const count = allLocationDetails.find(item => item.locationName === deviceData.locationName);
        setDeviceCount(count.noOfDevices)
        setLocationID(count._id)
    }

    const uploadImage = (e) => {
        setImageUpload(e.target.files[0]);
        setImageView(URL.createObjectURL(e.target.files[0]));
        setIsImageUpload(true);
    }

    const removeImage = () => {
        setImageView();
        setImageUpload();
        if (inputRef.current) {
            inputRef.current.value = null; // Reset the input value
        }
        setIsImageUploadEnable(true);
    }

    function onIsActiveChange() {
        setDeviceData({
            ...deviceData,
            isActive: !deviceData.isActive
        });
    }

    function UploadDevice() {
        if (isUpdate) {
            const formData = new FormData();
            formData.append("isActive", deviceData.isActive);
            formData.append("file", isImageUpload ? imageUpload : imageView);
            formData.append("updateID", updateID);

            axios.put('http://localhost:8000/Devices/updateDeviceDetail', formData).then((res) => {
                if (res.data.status == 'Success') {
                    toast.success("Device details updated successfullt!!");
                    handleClose();
                }
            })
        } else {
            if (imageView) {
                const formData = new FormData();
                formData.append("serial", serialNo);
                formData.append("locationName", deviceData.locationName);
                formData.append("deviceType", deviceData.deviceType);
                formData.append("isActive", deviceData.isActive /* == true ? parseInt(1) : parseInt(0) */);
                formData.append("file", imageUpload);

                axios.post('http://localhost:8000/Devices/saveDeviceDetails', formData).then((res) => {
                    if (res.data.ID) {
                        UpdateDeviceCount();
                    } else {
                        toast.error("Error occured in device saving!!")
                    }
                })
            } else {
                toast.error("Uplaod image before saving!!")
            }
        }
    }

    function UpdateDeviceCount() {
        const countUpdateModel = {
            loactionID: loactionID,
            deviceCount: deviceCount - 1
        }
        axios.put('http://localhost:8000/locations/updateLocationDeviceCount', countUpdateModel).then((res) => {
            if (res.data.status == 'Success') {
                setDeviceData({
                    ...deviceData,
                    serial: 0,
                    locationName: '',
                    deviceType: '',
                    isActive: false
                })
                setDeviceDialog(false);
                removeImage();
                setSerialNo(0);
                toast.success("Device Added Successfully!!");
            }
        })
    }

    function GetUpdateDeviceDetails() {
        axios.get(`http://localhost:8000/Devices/getUpdateDeviceDetailsByID/${updateRowID}`).then((res) => {
            setDeviceData({
                ...deviceData,
                locationName: res.data.DeviceDetails[0].locationName,
                deviceType: res.data.DeviceDetails[0].deviceType,
                isActive: res.data.DeviceDetails[0].isActive,
            })
            setIsUpdate(true);
            setImageView(res.data.DeviceDetails[0].image);
            setUpdateID(res.data.DeviceDetails[0]._id);
            setSerialNo(res.data.DeviceDetails[0].serial);
        })
    }

    return (
        <Dialog
            aria-labelledby="customized-dialog-title"
            open={deviceDialog}
            fullWidth
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                {isUpdate ? 'Update device' : 'Add devices'}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <Container maxWidth={false}>
                    <Formik
                        initialValues={{
                            serial: deviceData.serial,
                            locationName: deviceData.locationName,
                            deviceType: deviceData.deviceType,
                        }}

                        validationSchema={
                            Yup.object().shape({
                                deviceType: Yup.string().matches(/^(pos|kisok|signage)$/, 'Invalid device type').required('Device type is required'),
                            })
                        }
                        onSubmit={() => UploadDevice()}
                        enableReinitialize

                    >
                        {({
                            errors,
                            handleBlur,
                            handleSubmit,
                            touched
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Box mt={0}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Location Name *"
                                                id="outlined-size-small"
                                                size="small"
                                                name='locationName'
                                                value={deviceData.locationName}
                                                onChange={(e) => handleChange(e)}
                                                inputProps={{
                                                    readOnly: isUpdate
                                                }}
                                            >
                                                {allLocationDetails.map((row) => (
                                                    <MenuItem key={row._id} value={row.locationName}>
                                                        {row.locationName}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                error={Boolean(touched.serial && errors.serial)}
                                                helperText={touched.serial && errors.serial}
                                                label="Device Serial No. *"
                                                name='serial'
                                                value={serialNo}
                                                id='serial'
                                                variant="outlined"
                                                size="small"
                                                type='text'
                                                inputProps={{
                                                    readOnly: isUpdate
                                                }}
                                            />
                                        </Grid>
                                        {deviceData.locationName ?
                                            <>
                                                {!isUpdate ?
                                                    <Grid item md={6} xs={12} >
                                                        <Chip label={`No of Accessible devices : ${deviceCount}`} size="small" sx={{ background: '#51AFB9' }} />
                                                    </Grid> : null}
                                                <Grid item xs={6} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        select
                                                        error={Boolean(touched.deviceType && errors.deviceType)}
                                                        helperText={touched.deviceType && errors.deviceType}
                                                        label="Device Type *"
                                                        id="outlined-size-small"
                                                        size="small"
                                                        name='deviceType'
                                                        value={deviceData.deviceType}
                                                        onChange={(e) => handleChange(e)}
                                                        inputProps={{
                                                            readOnly: isUpdate
                                                        }}
                                                    >
                                                        <MenuItem value='pos'>pos </MenuItem>
                                                        <MenuItem value='kisok'>kisok </MenuItem>
                                                        <MenuItem value='signage'>signage </MenuItem>
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Grid item md={3} xs={12}>
                                                        <input
                                                            ref={inputRef}
                                                            type='file'
                                                            accept='image/*'
                                                            onChange={(e) => uploadImage(e)}
                                                            disabled={imageView}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                {(imageView && !isUpdate) ?
                                                    <Grid item xs={12} md={6} >
                                                        <Card >
                                                            <center>
                                                                <img
                                                                    src={imageView}
                                                                    width='200vw'
                                                                    height='250vh'
                                                                />
                                                                <IconButton>
                                                                    <CancelIcon
                                                                        sx={{ color: 'red' }}
                                                                        onClick={removeImage}
                                                                    />
                                                                </IconButton>
                                                            </center>
                                                        </Card>
                                                    </Grid> : null}
                                                {(isUpdate && imageView) ?
                                                    <Grid item xs={12} md={6} >
                                                        {isImageUploadEnable ?
                                                            <Card >
                                                                <center>
                                                                    <img
                                                                        src={imageView}
                                                                        width='200vw'
                                                                        height='250vh'
                                                                    />
                                                                    <IconButton>
                                                                        <CancelIcon
                                                                            sx={{ color: 'red' }}
                                                                            onClick={removeImage}
                                                                        />
                                                                    </IconButton>
                                                                </center>
                                                            </Card>
                                                            :
                                                            <Card >
                                                                <center>
                                                                    <img
                                                                        src={`http://localhost:8000/assets/deviceimages/${imageView}`}
                                                                        width='200vw'
                                                                        height='250vh'
                                                                    />
                                                                    <IconButton>
                                                                        <CancelIcon
                                                                            sx={{ color: 'red' }}
                                                                            onClick={removeImage}
                                                                        />
                                                                    </IconButton>
                                                                </center>
                                                            </Card>
                                                        }
                                                    </Grid> : null}
                                                <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'start' }} >
                                                    <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '15px' }}>Active </Typography>
                                                    <Switch
                                                        checked={deviceData.isActive}
                                                        onChange={onIsActiveChange}
                                                        name="isActive"
                                                    />
                                                </Grid>
                                                <Grid item md={12} xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Button
                                                        variant="contained"
                                                        size='small'
                                                        fullWidth
                                                        type='submit'
                                                    >
                                                        {isUpdate ? 'Update' : 'Save'}
                                                    </Button>
                                                </Grid>

                                            </>
                                            : null}
                                    </Grid>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Container>
            </DialogContent>





        </Dialog>
    )
}

export default AddEditDevice