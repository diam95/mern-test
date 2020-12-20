import React from "react";
import {Button, CircularProgress, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({

    test1Root: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: theme.spacing(3)
    },
    fetchButtonFetching: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around"
    },
    fetchButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        alignSelf: "flex-start",
        width:"100%",
        [theme.breakpoints.down("md")]: {
            width: `calc(100% - ${theme.spacing(2)}px)`,
            marginLeft: theme.spacing(1)
        }
    },
    checkboxContainer: {
        marginTop: theme.spacing(1),
        width: `100%`,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    clearPersistedDataButton: {
        marginTop: theme.spacing(1),
        alignSelf: "flex-start"
    }

}))

const Test1ComponentView = (props) => {

    const classes = useStyles()

    const handleDownloadAllProducts = props.handleDownloadAllProducts
    const isFetching = props.isFetching

    return (

        <div className={classes.test1Root}>

            <Button variant={"outlined"}
                    className={classes.fetchButton}
                    color={"primary"}
                    onClick={handleDownloadAllProducts}
            >
                {isFetching
                    ?
                    <div className={classes.fetchButtonFetching}>
                        <CircularProgress size={24}/>
                    </div>
                    : "Download Products"
                }
            </Button>

        </div>

    )

}

export default Test1ComponentView