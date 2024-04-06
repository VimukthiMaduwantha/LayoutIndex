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
    Typography,
    Chip
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from '@mui/icons-material/Search';

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

function Devices() {
    const [pageTitle, setpageTitle] = useState("Devices");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [deviceDialog, setDeviceDialog] = useState(false);
    const [deviceDetails, setDeviceDetails] = useState([]);
    const [imgView, setImgView] = useState();
    const [imageOpen, setImageOpen] = useState(false);
    const [deleteID, setDeleteID] = useState();
    const [dltDialogOpn, setDltDialogOpn] = useState(false);
    const [updateRowID, setUpdateRowID] = useState();
    const [searchDevice, setSearchDevice] = useState("");


    useEffect(() => {
        GetAlldeviceDetails();
    }, [])

    useEffect(() => {
        if (deviceDialog == false) {
            GetAlldeviceDetails();
        }
    }, [deviceDialog])


    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - deviceDetails.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function handleClick() {
        setDeviceDialog(true);
    }

    function GetAlldeviceDetails() {
        axios.get('http://localhost:8000/Devices/getAllDeviceDetails').then((res) => {
            if (res.data.DeviceDetails.length > 0) {
                setDeviceDetails(res.data.DeviceDetails);
            }
        })
    }

    function imagePreview(imageData) {
        setImgView(imageData);
        setImageOpen(true);
    }

    function removeImage() {
        setImgView();
        setImageOpen(false);
    }

    function DeleteRecord(deleteID) {
        setDeleteID(deleteID);
        setDltDialogOpn(true)
    }

    function handleConfirmDelete() {
        axios.delete(`http://localhost:8000/Devices/deleteDeviceDetails/${deleteID}`).then((res) => {
            if (res.data.message == 'Success') {
                setDltDialogOpn(false);
                GetAlldeviceDetails();
                toast.success("Location Detail Deleted Successfully!!")
            }
        })
    }

    function handleCancelDelete() {
        setDeleteID();
        setDltDialogOpn(false)
    }

    function UpdateRowData(updateID) {
        setUpdateRowID(updateID);
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
                        <Tooltip title="Add Devices">
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
                                    <TableContainer>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                                            <TextField
                                                id="input-with-sx"
                                                variant="standard"
                                                value={searchDevice}
                                                onChange={(e) => { setSearchDevice(e.target.value) }}
                                            />
                                        </Box>
                                        <br />
                                        <Table sx={{ minWidth: 500 }} size="small" aria-label="a dense table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>#</TableCell>
                                                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Serial No.</TableCell>
                                                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Device Type</TableCell>
                                                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Location Name</TableCell>
                                                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Image</TableCell>
                                                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>IsActive</TableCell>
                                                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {(rowsPerPage > 0
                                                    ? deviceDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    : deviceDetails
                                                ).filter((element) => {
                                                    if (searchDevice === "") {
                                                        return element;
                                                    } else if ((element.deviceType.toLowerCase()).includes(searchDevice.toLowerCase())) {
                                                        return element;
                                                    } else if ((element.locationName.toLowerCase()).includes(searchDevice.toLowerCase())) {
                                                        return element;
                                                    } else if ((element.serial.toLowerCase()).includes(searchDevice.toLowerCase())) {
                                                        return element;
                                                    }
                                                }).map((row, i) => (
                                                    <TableRow key={row._id}>
                                                        <TableCell align='center'>{i + 1}</TableCell>
                                                        <TableCell align='center'>{row.serial}</TableCell>
                                                        <TableCell align='center'>{row.deviceType}</TableCell>
                                                        <TableCell align='center'>{row.locationName}</TableCell>
                                                        <TableCell align='center'>
                                                            <IconButton
                                                                onClick={() => imagePreview(row.image)}
                                                            >
                                                                <VisibilityIcon sx={{ color: 'black' }} />
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            {row.isActive == true ?
                                                                <Chip label='Active' size="small" sx={{ background: '#51AFB9' }} /> :
                                                                <Chip label='Inactive' size="small" sx={{ background: '#51AFB9' }} />}
                                                        </TableCell>
                                                        <TableCell align='center'>
                                                            <IconButton>
                                                                <CreateIcon sx={{ color: 'black' }} onClick={() => UpdateRowData(row._id)} />
                                                            </IconButton>
                                                            &nbsp;
                                                            <IconButton>
                                                                <DeleteIcon sx={{ color: 'black' }} onClick={() => DeleteRecord(row._id)} />
                                                            </IconButton>

                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {emptyRows > 0 && (
                                                    <TableRow style={{ height: 53 * emptyRows }}>
                                                        <TableCell colSpan={7} />
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TablePagination
                                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                                        colSpan={7}
                                                        count={deviceDetails.length}
                                                        rowsPerPage={rowsPerPage}
                                                        page={page}
                                                        slotProps={{
                                                            select: {
                                                                inputProps: {
                                                                    'aria-label': 'rows per page',
                                                                },
                                                                native: true,
                                                            },
                                                        }}
                                                        onPageChange={handleChangePage}
                                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                                        ActionsComponent={TablePaginationActions}
                                                    />
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                    </TableContainer>

                                    {/* image preview dialog */}
                                    <Dialog open={imageOpen}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                paddingTop: "1vh",
                                                paddingRight: "1vw",
                                            }}
                                        >
                                            <IconButton>
                                                <CancelIcon
                                                    sx={{ color: "red", fontSize: "2vw" }}
                                                    onClick={removeImage}
                                                />
                                            </IconButton>
                                        </Box>
                                        <DialogContent>
                                            <Card
                                                style={{
                                                    height: 400,
                                                    width: 300,
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <img
                                                    src={`http://localhost:8000/assets/deviceimages/${imgView}`}
                                                    height="100%"
                                                    width="auto"
                                                />
                                            </Card>
                                        </DialogContent>
                                    </Dialog>

                                    {/* delete dialog box */}
                                    <Dialog
                                        open={dltDialogOpn}
                                        aria-labelledby="responsive-dialog-title"
                                    >
                                        <DialogContent>
                                            <Typography sx={{ fontWeight: "bold" }}>
                                                Do you want to delete this record?
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <br />
                                            </Typography>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button
                                                sx={{ color: "black", fontWeight: "bold" }}
                                                autoFocus
                                                onClick={handleCancelDelete}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                sx={{ color: "black", fontWeight: "bold" }}
                                                onClick={handleConfirmDelete}
                                                autoFocus
                                            >
                                                Delete
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
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
                updateRowID={updateRowID}
                setUpdateRowID={setUpdateRowID}
            />


        </>
    )
}

export default Devices