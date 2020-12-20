import React from "react"
import {makeStyles, Tab, Tabs, useTheme} from "@material-ui/core";
import Test1Component from "./Test1Component/Test1Component";
import Test2Component from "./Test2Component/Test2Component";

const useStyles = makeStyles((theme) => ({

    content: {
        marginTop: theme.spacing(3),
        [theme.breakpoints.down("md")]: {
            width: "100%",
            margin: theme.spacing(0)
        }
    },
    tabPanelContainer:{

    }

}))


const MainContentView = (props) => {

    const classes = useStyles()

    const matches = props.matches
    const selectedTab = props.selectedTab
    const handleTabSelect = props.handleTabSelect
    const productsArray = props.productsArray
    const isFetching = props.isFetching
    const setIsFetching = props.setIsFetching
    const setProductsArray = props.setProductsArray

    const theme = useTheme();

    const TabPanel = (props) => {

        const {children, value, index, ...other} = props;

        return (
            <div
                className={classes.tabPanelContainer}
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <div className={classes.tabPanel}>{children}</div>
                )}
            </div>
        );
    }

    const a11yProps = (index) => {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    const getVariant = () => {

        if (matches) {
            return "fullWidth"
        }

    }

    return (
        <div className={classes.content}>

            <Tabs
                value={selectedTab}
                variant={getVariant()}
                onChange={handleTabSelect}
                indicatorColor={"primary"}
                aria-label="full width tabs example"
            >
                <Tab label="Test #1" {...a11yProps(0)} wrapped={matches}/>
                <Tab label="Test #2" {...a11yProps(1)} wrapped={matches}/>
            </Tabs>

            <TabPanel value={selectedTab} index={0} dir={theme.direction}>

                <Test1Component isFetching={isFetching}
                                setIsFetching={setIsFetching}
                                productsArray={productsArray}
                                setProductsArray={setProductsArray}
                />

            </TabPanel>

            <TabPanel value={selectedTab} index={1} dir={theme.direction}>

                <Test2Component productsArray={productsArray}
                                matches={matches}
                />

            </TabPanel>

        </div>
    )

}

export default MainContentView