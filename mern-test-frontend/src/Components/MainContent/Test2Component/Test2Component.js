import React, {useState} from "react";
import Test2ComponentView from "./Test2ComponentView";
import axios from "axios";
import {Button} from "@material-ui/core";
import {useSnackbar} from "notistack";

const Test2Component = (props) => {

    const matches = props.matches
    const productsArray = props.productsArray

    const [editDialog, setEditDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState({name: "", description: "", code: "", price: undefined, attributes: []});
    const {enqueueSnackbar} = useSnackbar();

    const handleCloseEditDialog = () => {

        setSelectedProduct({name: "", description: "", code: "", price: undefined, attributes: []})
        setEditDialog(false)

    }

    const handleOpenDialog = (product) => {

        setSelectedProduct(product)
        setEditDialog(true)

    }

    const handleRemoveItem = (product) => {

        const handleUndo = () => {

            axios.post("http://192.168.0.10:9000/products/new", product).then(r => {

                enqueueSnackbar("Product restored", {
                    variant: "info"
                })

            }).catch(err => {
                enqueueSnackbar("Error:" + err, {
                    variant: "error"
                })
            })

        }

        axios.post("http://192.168.0.10:9000/products/delete", product).then(r => {

            enqueueSnackbar("Product successfully removed", {
                variant: "info",
                action: <Button onClick={handleUndo} variant={"text"} color={"primary"}>Undo</Button>
            })
            handleCloseEditDialog()

        }).catch(err => {

            enqueueSnackbar("Error: " + err, {
                variant: "error"
            })
            handleCloseEditDialog()

        })

    }

    return (

        <Test2ComponentView matches={matches}
                            productsArray={productsArray}
                            editDialog={editDialog}
                            handleCloseEditDialog={handleCloseEditDialog}
                            handleOpenDialog={handleOpenDialog}
                            selectedProduct={selectedProduct}
                            handleRemoveItem={handleRemoveItem}
        />

    )

}

export default Test2Component