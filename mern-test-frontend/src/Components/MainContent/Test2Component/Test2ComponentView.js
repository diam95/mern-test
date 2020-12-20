import React from "react";
import {
    Button,
    IconButton,
    makeStyles,
    Typography
} from "@material-ui/core";
import EditDialog from "./EditDialog";
import MaterialTable from "material-table";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from '@material-ui/icons/Delete';
const useStyles = makeStyles((theme) => ({

    tableContainerRoot: {
        width: "100%"
    },
    test2Root: {
        width: `100%`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: theme.spacing(3)
    },
    tabTitle: {
        alignSelf: "flex-start",
        marginLeft: theme.spacing(2)
    },
    productItemContainer: {
        width:"100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    productItemDetails: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    divider: {
        width: "100%"
    },
    tableHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1)
    },
    buttonsContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }

}))

const Test2ComponentView = (props) => {

    const matches = props.matches
    const productsArray = props.productsArray
    const editDialog = props.editDialog
    const handleCloseEditDialog = props.handleCloseEditDialog
    const handleOpenDialog = props.handleOpenDialog
    const selectedProduct = props.selectedProduct
    const handleRemoveItem = props.handleRemoveItem

    const classes = useStyles()

    const renderTableHeader = () => {

        const handleAddNewProduct = () => {

            handleOpenDialog({name: "", description: "", code: "", price: undefined})

        }

        return (
            <tbody>
            <tr>
                <td className={classes.tableHeader}>

                    <Button variant={"outlined"}
                            color={"primary"}
                            onClick={handleAddNewProduct}
                    >
                        Add product
                    </Button>

                </td>
            </tr>
            </tbody>
        )

    }

    const renderProductItem = (product) => {

        return (
            <div className={classes.productItemContainer}>

                <div className={classes.productItemDetails}>

                    <Typography variant={"caption"}>{product.code}</Typography>
                    <Typography variant={"subtitle1"}>{product.name}</Typography>
                    <Typography variant={"h6"}>{product.price}</Typography>

                </div>

                <div className={classes.buttonsContainer}>
                    <IconButton onClick={() => {
                        handleOpenDialog(product)
                    }}>
                        <EditIcon/>
                    </IconButton>

                    <IconButton onClick={() => {
                        handleRemoveItem(product)
                    }}>
                        <DeleteIcon/>
                    </IconButton>
                </div>

            </div>
        )

    }

    return (

        <div className={classes.test2Root}>

            <Typography variant={"h6"} className={classes.tabTitle}>CRUD UI</Typography>

            <div className={classes.tableContainerRoot}>
                <MaterialTable
                    columns={[
                        {
                            render: rowData => renderProductItem(rowData)
                        }
                    ]}
                    data={productsArray}
                    options={{
                        pageSize: 50,
                        pageSizeOptions: [50]
                    }}
                    components={{
                        Header: () => renderTableHeader(),
                        Container: props1 => (<>
                            <div>{props1.children}</div>
                        </>),
                        Toolbar: () => (<></>)
                    }}
                />
            </div>

            <EditDialog matches={matches}
                        editDialog={editDialog}
                        handleCloseEditDialog={handleCloseEditDialog}
                        selectedProduct={selectedProduct}
            />

        </div>

    )

}

export default Test2ComponentView