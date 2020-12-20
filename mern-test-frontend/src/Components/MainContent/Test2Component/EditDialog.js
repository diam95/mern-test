import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, IconButton,
    makeStyles,
    TextField, Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close"
import AddIcon from "@material-ui/icons/Add"
import DeleteIcon from '@material-ui/icons/Delete';
import {useSnackbar} from "notistack";
import axios from "axios";

const useStyles = makeStyles((theme) => ({

    dialogRoot:{
    },
    editTextfield: {
        marginBottom: theme.spacing(2)
    },
    editTextfield2: {
        marginTop: theme.spacing(2)
    },
    checkboxContainer: {
        marginTop: theme.spacing(1),
        width: `100%`,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    productDetailsTitle: {
        marginBottom: theme.spacing(2),
        color: "#808080"
    },
    productAttributesTitle: {
        color: "#808080",
        marginRight: theme.spacing(1)
    },
    attributesTextfieldsContainer: {},
    attributeNumber: {},
    attributesContainer: {
        marginBottom: theme.spacing(2)
    },
    dialogTitle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    dialogTitleAttributes: {
        marginTop: theme.spacing(2),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-start"
    },
    dialogAttrsActions: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    }

}))

const EditDialog = (props) => {

    const classes = useStyles()

    const matches = props.matches
    const editDialog = props.editDialog
    const handleCloseEditDialog = props.handleCloseEditDialog
    const selectedProduct = props.selectedProduct

    const nameRef = useRef(null)
    const priceRef = useRef(null)
    const codeRef = useRef(null)

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [selectedProductTemp, setSelectedProductTemp] = useState({name: "", description: "", code: "", price: undefined});

    useEffect(() => {

        setSelectedProductTemp({...selectedProduct})

        return(()=>{
            setSelectedProductTemp({...selectedProduct})
        })

    }, [selectedProduct])

    const handleInputChange = (event, type) => {

        switch (type) {

            case "name": {
                const tempName = {...selectedProductTemp}
                tempName.name = event.target.value
                setSelectedProductTemp(tempName)
                break
            }

            case "description": {
                const tempName = {...selectedProductTemp}
                tempName.description = event.target.value
                setSelectedProductTemp(tempName)
                break
            }

            case "code": {
                const tempCode = {...selectedProductTemp}
                tempCode.code = event.target.value
                setSelectedProductTemp(tempCode)
                break
            }

            case "price": {
                const tempPrice = {...selectedProductTemp}
                tempPrice.price = event.target.value
                setSelectedProductTemp(tempPrice)
                break
            }

            default:
                break

        }

    }

    const handleAttributesChange = (event, type, ind) => {

        const temp = {...selectedProductTemp}

        switch (type) {

            case "key": {
                temp.attributes[ind].key = event.target.value
                setSelectedProductTemp({...temp})
                break
            }

            case "entity": {
                temp.attributes[ind].entity = event.target.value
                setSelectedProductTemp({...temp})
                break
            }

            case "isRequired": {
                temp.attributes[ind].isRequired = event.target.checked
                setSelectedProductTemp({...temp})
                break
            }

            default:
                break

        }

    }

    const handleAttrDelete = (ind) => {

        const deletedAttr = selectedProductTemp.attributes[ind]

        const temp = {...selectedProductTemp}

        const handleUndo = () => {

            closeSnackbar()

            enqueueSnackbar("Attribute has been restored", {
                variant: "info"
            })

            temp.attributes.push(deletedAttr)
            setSelectedProductTemp({...temp})

        }

        temp.attributes.splice(ind, 1)
        setSelectedProductTemp({...temp})

        enqueueSnackbar("Attribute has been deleted", {
            variant: "info",
            action: <Button onClick={handleUndo} variant={"text"}>undo</Button>
        })

    }

    const handleClose = () => {

        closeSnackbar()

        handleCloseEditDialog()

    }

    const handleAddNewProduct = () => {

        if (selectedProductTemp.name.length > 0) {

            if (selectedProductTemp.code.length > 0) {

                if (selectedProductTemp.price > 0) {

                    if (!selectedProductTemp._id) {

                        axios.post("http://192.168.0.10:9000/products/new", selectedProductTemp).then(r => {

                            enqueueSnackbar("New product was successfully added", {
                                variant: "success"
                            })
                            handleCloseEditDialog()

                        }).catch(err => {

                            enqueueSnackbar("Error: " + err.message, {
                                variant: "error"
                            })
                            handleCloseEditDialog()

                        })


                    } else {

                        axios.post("http://192.168.0.10:9000/products/update", selectedProductTemp).then(r => {

                            enqueueSnackbar("Product successfully updated", {
                                variant: "success"
                            })
                            handleCloseEditDialog()

                        }).catch(err => {

                            enqueueSnackbar("Error: " + err, {
                                variant: "error"
                            })
                            handleCloseEditDialog()

                        })


                    }

                } else {
                    priceRef.current.focus()
                }

            } else {
                codeRef.current.focus()
            }
        } else {
            nameRef.current.focus()
        }

    }

    const handleAddAttribute = () => {

        const temp = {...selectedProductTemp}

        if (temp.attributes) {
            temp.attributes.push({entity: "", key: "", isRequired: false})
        } else {
            temp.attributes = []
            temp.attributes.push({entity: "", key: "", isRequired: false})
        }

        setSelectedProductTemp(temp)
        enqueueSnackbar("New attribute has been added", {
            variant: "info"
        })

    }

    const renderAttributes = () => {

        if (selectedProductTemp.attributes) {

            return selectedProductTemp.attributes.map((attribute, ind) => {

                return (
                    <div className={classes.attributesContainer} key={attribute.key + ind}>

                        <div className={classes.dialogAttrsActions}>

                            <Typography variant={"h6"} className={classes.attributeNumber}>#{ind + 1}</Typography>

                            <IconButton onClick={() => {
                                handleAttrDelete(ind)
                            }}>
                                <DeleteIcon/>
                            </IconButton>

                        </div>

                        <div className={classes.attributesTextfieldsContainer}>

                            <TextField variant={"outlined"}
                                       value={selectedProductTemp.attributes[ind].key}
                                       label={"Key"}
                                       fullWidth
                                       onChange={(event) => {
                                           handleAttributesChange(event, "key", ind)
                                       }}
                                       className={classes.editTextfield2}
                            />

                            <TextField variant={"outlined"}
                                       value={selectedProductTemp.attributes[ind].entity}
                                       label={"Entity"}
                                       fullWidth
                                       onChange={(event) => {
                                           handleAttributesChange(event, "entity", ind)
                                       }}
                                       className={classes.editTextfield2}
                            />

                        </div>

                        <div className={classes.checkboxContainer}>
                            <Checkbox
                                checked={selectedProductTemp.attributes[ind].isRequired}
                                onChange={(event) => {
                                    handleAttributesChange(event, "isRequired", ind)
                                }}
                                inputProps={{'aria-label': 'primary checkbox'}}
                            />
                            <Typography>
                                Is Required
                            </Typography>
                        </div>

                    </div>
                )
            })
        }

    }

    return (
        <Dialog open={editDialog}
                fullScreen={matches}
                onClose={handleClose}
                keepMounted={false}
                className={classes.dialogRoot}
        >

            <DialogTitle id="simple-dialog-title">
                <div className={classes.dialogTitle}>

                    <div>Edit product</div>

                    <IconButton onClick={handleClose}>
                        <CloseIcon/>
                    </IconButton>

                </div>
            </DialogTitle>

            <DialogContent>

                <Typography variant={"h6"} className={classes.productDetailsTitle}>Product details</Typography>

                <TextField variant={"outlined"}
                           label={"Code"}
                           value={selectedProductTemp.code}
                           fullWidth
                           inputRef={(el) => (codeRef.current = el)}
                           onChange={(e) => {
                               handleInputChange(e, "code")
                           }}
                           className={classes.editTextfield}
                />

                <TextField variant={"outlined"}
                           label={"Name"}
                           value={selectedProductTemp.name}
                           inputRef={(el) => (nameRef.current = el)}
                           fullWidth
                           onChange={(e) => {
                               handleInputChange(e, "name")
                           }}
                           className={classes.editTextfield}
                />


                <TextField variant={"outlined"}
                           label={"Price"}
                           type={"number"}
                           value={selectedProductTemp.price}
                           inputRef={(el) => (priceRef.current = el)}
                           fullWidth
                           onChange={(e) => {
                               handleInputChange(e, "price")
                           }}
                           className={classes.editTextfield}
                />

                <TextField variant={"outlined"}
                           label={"Description"}
                           value={selectedProductTemp.description}
                           fullWidth
                           inputRef={(el) => (codeRef.current = el)}
                           onChange={(e) => {
                               handleInputChange(e, "description")
                           }}
                           className={classes.editTextfield}
                />

                <div className={classes.dialogTitleAttributes}>

                    <Typography variant={"h6"} className={classes.productAttributesTitle}>
                        Product attributes
                    </Typography>

                    <IconButton onClick={handleAddAttribute}>
                        <AddIcon/>
                    </IconButton>

                </div>

                {renderAttributes()}

            </DialogContent>

            <DialogActions>

                <Button variant={"text"}
                        onClick={handleClose}
                >
                    Back
                </Button>

                <Button variant={"text"}
                        color={"primary"}
                        onClick={handleAddNewProduct}
                >
                    Ok
                </Button>

            </DialogActions>

        </Dialog>
    )

}

export default EditDialog