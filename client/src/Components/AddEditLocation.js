import { Box, Button, Card, CardHeader, Container, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, MenuItem, TextField, Tooltip, Typography, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Formik } from 'formik'
import * as Yup from "yup";
import axios, { Axios } from 'axios';
import { toast } from 'react-toastify';

function AddEditLocation({ dialogOpen, setDialogOpen, updateRowID, setUpdateRowID }) {
    const [formLocation, setFormLocation] = useState({
        locationName: '',
        locationAddress: '',
        phone: '',
        noOfDevices: 0
    })
    const [isUpdate, setIsUpdate] = useState(false);


    useEffect(() => {
        if (updateRowID) {
            axios.get(`http://localhost:8000/locations/getLocationDetailsByID/${updateRowID}`).then((res) => {
                setFormLocation({
                    ...formLocation,
                    locationName: res.data.LocationDetails[0].locationName,
                    locationAddress: res.data.LocationDetails[0].locationAddress,
                    phone: res.data.LocationDetails[0].phone,
                    noOfDevices: res.data.LocationDetails[0].noOfDevices
                })
                setIsUpdate(true);
            })
        }
    }, [updateRowID])

    const handleClose = () => {
        setDialogOpen(false);
        setFormLocation({
            ...formLocation,
            locationName: '',
            locationAddress: '',
            phone: '',
            noOfDevices: 0
        })
        setIsUpdate(false);
    }

    function handleChange(e) {
        const target = e.target;
        const value = target.value;
        setFormLocation({
            ...formLocation,
            [e.target.name]: value
        })
    }

    function UploadLocation() {
        if (isUpdate) {
            const updateModel = {
                locationAddress: formLocation.locationAddress,
                phone: formLocation.phone,
                updateRowID: updateRowID
            }

            axios.put('http://localhost:8000/locations/updateLocationDetails', updateModel).then((res) => {
                console.log("Update::> ", res.data)
                if (res.data.status == 'Success') {
                    handleClose();
                    toast.success("Location Updated Successfully!!")
                }
            })
        } else {
            const saveModel = {
                locationName: formLocation.locationName,
                locationAddress: formLocation.locationAddress,
                phone: formLocation.phone,
                noOfDevices: parseInt(formLocation.noOfDevices)
            }

            axios.post('http://localhost:8000/locations/addLocations', saveModel).then((res) => {
                if (res.data.ID) {
                    handleClose();
                    toast.success("Location Added Successfully!!")
                }
            })
        }
    }

    return (
        <>
            <Dialog
                aria-labelledby="customized-dialog-title"
                open={dialogOpen}
                fullWidth
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    {isUpdate ? 'Update Location' : 'Add Locations'}
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
                                locationName: formLocation.locationName,
                                locationAddress: formLocation.locationAddress,
                                phone: formLocation.phone,
                                noOfDevices: formLocation.noOfDevices
                            }}

                            validationSchema={
                                Yup.object().shape({
                                    locationName: Yup.string().required('Item Name is required'),
                                })
                            }
                            onSubmit={() => UploadLocation()}
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
                                            <Grid item md={12} xs={12}>
                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched.locationName && errors.locationName)}
                                                    helperText={touched.locationName && errors.locationName}
                                                    label="Location Name *"
                                                    name='locationName'
                                                    value={formLocation.locationName}
                                                    id='locationName'
                                                    variant="outlined"
                                                    size="small"
                                                    type='text'
                                                    onChange={(e) => handleChange(e)}
                                                    inputProps={{
                                                        readOnly: isUpdate
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={12} xs={12}>
                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched.locationAddress && errors.locationAddress)}
                                                    helperText={touched.locationAddress && errors.locationAddress}
                                                    label="Location Address"
                                                    name='locationAddress'
                                                    value={formLocation.locationAddress}
                                                    id='locationAddress'
                                                    variant="outlined"
                                                    size="small"
                                                    type='text'
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched.phone && errors.phone)}
                                                    helperText={touched.phone && errors.phone}
                                                    label="Phone Number"
                                                    name='phone'
                                                    value={formLocation.phone}
                                                    id='phone'
                                                    variant="outlined"
                                                    size="small"
                                                    type='text'
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    fullWidth
                                                    error={Boolean(touched.noOfDevices && errors.noOfDevices)}
                                                    helperText={touched.noOfDevices && errors.noOfDevices}
                                                    label="No of associated devices"
                                                    name='noOfDevices'
                                                    value={formLocation.noOfDevices}
                                                    id='noOfDevices'
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => handleChange(e)}
                                                    inputProps={{
                                                        readOnly: isUpdate
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={12} xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <Button
                                                    variant="contained"
                                                    size='small'
                                                    fullWidth
                                                    type='submit'
                                                >
                                                    {isUpdate ? 'Update' : 'Submit'}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </form>
                            )}

                        </Formik>
                    </Container>
                </DialogContent>

            </Dialog>

        </>
    )
}

export default AddEditLocation