import React, {useState} from "react"
import MainContentView from "./MainContentView";

const MainContent = (props) => {

    const matches = props.matches
    const productsArray = props.productsArray
    const isFetching = props.isFetching
    const setIsFetching = props.setIsFetching
    const setProductsArray = props.setProductsArray

    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabSelect = (event, newValue) => {

        setSelectedTab(newValue)

    }

    return (
        <MainContentView matches={matches}
                         productsArray={productsArray}
                         selectedTab={selectedTab}
                         handleTabSelect={handleTabSelect}
                         isFetching={isFetching}
                         setIsFetching={setIsFetching}
                         setProductsArray={setProductsArray}

        />
    )

}

export default MainContent