import React, { useEffect, useState } from 'react'
import {
    MenuItem,
    Tooltip,
    styled,
    Box,
    Button,
    Card,
    CardHeader,
    Container,
    Divider,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Dialog,
    DialogContent,
    DialogActions,
    Typography
} from '@mui/material'
import { Formik } from 'formik'
import * as Yup from "yup";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddEditLocation from '../Components/AddEditLocation';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import { toast } from 'react-toastify';
import AddEditDevice from '../Components/AddEditDevice';

function Devices() {
    const [pageTitle, setpageTitle] = useState("Devices");
    const [deviceDialog, setDeviceDialog] = useState(false);



    function handleClick() {
        setDeviceDialog(true);
    }


    function cardTitle(titleName) {
        return (
            <Grid container spacing={1}>
                <Grid item md={11} xs={11}>
                    {titleName}
                </Grid>
                <Grid item md={1} xs={1}>
                    <Box display='flex' justifyContent='flex-end' alignItems='center' >
                        <Tooltip title="Add Locations">
                            <IconButton>
                                <AddCircleOutlineIcon onClick={() => handleClick()} sx={{ color: 'black' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Grid>
            </Grid>
        )
    }

    return (
        <>
            <Container maxWidth={false}>
                <Formik>
                    {({
                        errors,
                        handleBlur,
                        handleSubmit,
                        touched
                    }) => (
                        <form>
                            <Box mt={0}>
                                <Card sx={{ padding: '15px' }}>
                                    <CardHeader
                                        title={cardTitle(pageTitle)}
                                        sx={{ fontWeight: 'bold', }}
                                    />
                                    <Divider />
                                    <br />
                                </Card>
                            </Box>
                        </form>
                    )
                    }
                </Formik>
            </Container>

            {/* Add edit devices dialog */}
            <AddEditDevice
                deviceDialog={deviceDialog}
                setDeviceDialog={setDeviceDialog}
            />


        </>
    )
}

export default Devices