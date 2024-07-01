import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext()

const DataContextProvider = ({ children }) => {
    const [csvData, setCsvData] = useState({
        newUsers: undefined,
        returningUsers: undefined,
        sessions: undefined
    })

    useEffect(() => {
        console.log(csvData)
    }, [csvData])

    const setData = (key, value) => {
        setCsvData({
            ...csvData,
            [key]: value
        })
    }

    const payload = {
        csvData,
        setCsvData,
        setData
    }

    return <DataContext.Provider value={payload}>{children}</DataContext.Provider>
}

const useDataContext = () => {
    const context = useContext(DataContext)

    return context
}

export {
    DataContextProvider,
    useDataContext
}