import React from "react";
import Test1ComponentView from "./Test1ComponentView";
import axios from "axios"
import {useSnackbar} from 'notistack';

const Test1Component = (props) => {

    const isFetching = props.isFetching
    const setIsFetching = props.setIsFetching
    const productsArray = props.productsArray
    const setProductsArray = props.setProductsArray

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const handleDownloadAllProducts = () => {

        if (!isFetching) {

            setIsFetching(true)

            closeSnackbar()
            enqueueSnackbar(`Fetching data, please do not close this page`, {
                variant: 'info',
                persist: true
            });

            axios.post("http://192.168.0.10:9000/products/fetchAll").then(r => {

                if (r.status === 200) {

                    closeSnackbar()
                    enqueueSnackbar(`Fetched ${r.data.count} products`, {
                        variant: 'success',
                    });

                }

                const temp = [...productsArray]
                r.data.products.forEach(product => {

                    temp.unshift(product)

                })
                setProductsArray(temp)
                setIsFetching(false)

            }).catch(err => {
                if (err) {

                    closeSnackbar()
                    enqueueSnackbar(`Fetching failed due to: ${err.message}`, {
                        variant: 'error'
                    });
                    setIsFetching(false)

                }
            })

        }

    }


    return (

        <Test1ComponentView handleDownloadAllProducts={handleDownloadAllProducts}
                            isFetching={isFetching}
        />

    )

}

export default Test1Component