import { Box, Button, Card, CardHeader, Chip, Container, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, Switch, TextField, Tooltip, Typography, styled } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Formik } from 'formik'
import * as Yup from "yup";
import axios, { Axios } from 'axios';
import { toast } from 'react-toastify';
import CancelIcon from '@mui/icons-material/Cancel';

function AddEditDevice({ deviceDialog, setDeviceDialog }) {
    const inputRef = useRef(null);
    const [deviceData, setDeviceData] = useState({
        serial: 0,
        locationName: '',
        deviceType: '',
        isActive: false
    })
    console.log("deviceData::> ", deviceData.isActive)
    const [serialNo, setSerialNo] = useState(0);
    const [allLocationDetails, setAllLocationDetails] = useState([]);
    const [deviceCount, setDeviceCount] = useState();
    const [imageUpload, setImageUpload] = useState();
    const [imageView, setImageView] = useState();


    useEffect(() => {
        GetSerialNo();
        GetLocationsDetails();
    }, [])

    useEffect(() => {
        if (deviceData.locationName) {
            GetTheTotalNoOfDevices();
        }
    }, [deviceData.locationName])

    function handleClose() {
        setDeviceDialog(false);
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
    }

    const uploadImage = (e) => {
        setImageUpload(e.target.files[0]);
        setImageView(URL.createObjectURL(e.target.files[0]))
    }

    const removeImage = () => {
        setImageView();
        setImageUpload();
        if (inputRef.current) {
            inputRef.current.value = null; // Reset the input value
        }
    }

    function onIsActiveChange() {
        setDeviceData({
            ...deviceData,
            isActive: !deviceData.isActive
        });
    }







    return (
        <Dialog
            aria-labelledby="customized-dialog-title"
            open={deviceDialog}
            fullWidth
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Add devices
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
                                locationName: Yup.string().required('Item Name is required'),
                            })
                        }
                        // onSubmit={() => UploadLocation()}
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
                                                    // readOnly: isUpdate
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Location Name"
                                                id="outlined-size-small"
                                                size="small"
                                                name='locationName'
                                                value={deviceData.locationName}
                                                onChange={(e) => handleChange(e)}
                                            >
                                                {allLocationDetails.map((row) => (
                                                    <MenuItem key={row._id} value={row.locationName}>
                                                        {row.locationName}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        {deviceData.locationName ?
                                            <>
                                                <Grid item md={6} xs={12}>
                                                    <Chip label={`No of Accessible devices : ${deviceCount}`} size="small" sx={{ background: '#51AFB9' }} />
                                                </Grid>

                                                <Grid item xs={6} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        select
                                                        label="Device Type *"
                                                        id="outlined-size-small"
                                                        size="small"
                                                        name='deviceType'
                                                        value={deviceData.deviceType}
                                                        onChange={(e) => handleChange(e)}
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
                                                {imageView ?
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
                                                <Grid item xs={12} md={12} >
                                                    <Switch
                                                        checked={deviceData.isActive}
                                                        onChange={onIsActiveChange}
                                                        name="isActive"
                                                    />
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