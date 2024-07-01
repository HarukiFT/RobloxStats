import { toast } from 'react-toastify'
import { useDataContext } from '../contexts/DataContext'
import Styles from '../styles/Proceed.module.scss'
import DataSet from '../services/handleData'

export default () => {
    const dataContext = useDataContext()

    const validate = () => {
        for (let entry of Object.entries(dataContext.csvData)) {
            if (!entry[1]) return false;
        }

        return true
    }

    const handleClick = () => {
        if (!validate()) return toast.error('Загрузи все данные!');

        const blob = new DataSet(dataContext.csvData.newUsers, dataContext.csvData.returningUsers, dataContext.csvData.sessions).proceed()
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className={Styles.holder}>
            <input className={Styles.proceedButton} onClick={handleClick} type='button' value='Обработать'/>
        </div>
    )
}