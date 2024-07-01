import { toast } from 'react-toastify'
import { useDataContext } from '../contexts/DataContext'
import Styles from '../styles/Proceed.module.scss'
import DataSet from '../services/handleData'
import { useSpring, animated } from 'react-spring'

export default () => {
    const dataContext = useDataContext()

    const validateExist = () => {
        for (let entry of Object.entries(dataContext.csvData)) {
            if (!entry[1]) return false;
        }

        return true
    }

    const handleClick = () => {
        if (!validateExist()) return toast.error('Загрузи все данные!');
        const blob = new DataSet(dataContext.csvData.newUsers, dataContext.csvData.returningUsers, dataContext.csvData.sessions).proceed()

        if (!blob) {
            return toast.error('Таймфреймы не совпадают!')
        }

        // Blob auto download
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', 'data.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Reset data
        dataContext.setCsvData(Object.fromEntries(Object.entries(dataContext.csvData).map(([key, ]) => {
            return [key, null]
        })))
    }

    const proceedButtonAnimation = useSpring({
        to: {
            border: validateExist() ? '2px solid rgba(0, 255, 0, .5)' : '2px solid #e75437'
        }
    })

    return (
        <div className={Styles.holder}>
            <animated.input style={proceedButtonAnimation} className={Styles.proceedButton} onClick={handleClick} type='button' value='Провести обработку'/>
        </div>
    )
}