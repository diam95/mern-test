import React, {useEffect, useState} from "react"
import Appbar from "./Components/Appbar/Appbar";
import MainContent from "./Components/MainContent/MainContent";
import {makeStyles, useMediaQuery, useTheme} from "@material-ui/core";
import {SnackbarProvider} from 'notistack';
import Pusher from "pusher-js";
import axios from "axios";

const useStyles = makeStyles((theme) => ({

    root: {
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
    }

}))

const pusherAppKey = "0ef9f124576ed1c33505"

const App = () => {

    const classes = useStyles()

    const [productsArray, setProductsArray] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const theme = useTheme()

    useEffect(() => {

        const productsArrayTemp = [...productsArray]
        const pusher = new Pusher(pusherAppKey, {
            cluster: 'ap3'
        });
        const channel = pusher.subscribe('products');

        const subscribeToDbEvents = () => {

            channel.bind('inserted', data => {

                const isNew = productsArrayTemp.filter(item => {

                    return item._id === data._id

                }).length === 0

                if (isNew){
                    productsArrayTemp.unshift(data)
                    setProductsArray([...productsArrayTemp])
                }

            });

            channel.bind("delete", ID => {

                productsArrayTemp.forEach((product, ind) => {

                    if (product._id === ID) {

                        productsArrayTemp.splice(ind, 1)
                        setProductsArray([...productsArrayTemp])

                    }

                })

            })

            channel.bind("replace", product => {

                productsArrayTemp.forEach((item, ind) => {

                    if (item._id === product._id) {
                        productsArrayTemp[ind] = product
                        setProductsArray([...productsArrayTemp])
                    }

                })

            })

        }

        if (productsArrayTemp.length === 0) {

            axios.get("http://192.168.0.10:9000/getInitialData").then(r => {

                const values = Object.values(r.data)

                if (values.length > 0) {

                    values.forEach((item, ind) => {

                        productsArrayTemp.push(item)

                        if (values.length === ind + 1) {
                            setProductsArray([...productsArrayTemp])
                        }

                    })

                } else {

                    subscribeToDbEvents()

                }

            }).catch(err => {

                alert(err)

            })
        } else {

            subscribeToDbEvents()

        }

        return (() => {

            channel.unbind_all()
            channel.unsubscribe()

        })

    }, [productsArray])

    const matches = useMediaQuery(theme.breakpoints.down('md'), {noSsr: true});

    return (
        <SnackbarProvider maxSnack={1} anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
        }}
        >
            <div className={classes.root}>

                <Appbar/>

                <MainContent matches={matches}
                             productsArray={productsArray}
                             isFetching={isFetching}
                             setIsFetching={setIsFetching}
                             setProductsArray={setProductsArray}
                />

            </div>
        </SnackbarProvider>
    );
}

export default App;
