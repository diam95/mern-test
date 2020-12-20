import React from "react"
import {AppBar, IconButton, makeStyles, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({

    menuButton: {
        marginRight: theme.spacing(1)
    }

}))

const AppbarView = (props) => {

    const classes = useStyles()

    return (
        <AppBar position="static" className={classes.appBarRoot}>
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" color="inherit">
                   diam_95@yahoo.com
                </Typography>
            </Toolbar>
        </AppBar>
    )

}

export default AppbarView