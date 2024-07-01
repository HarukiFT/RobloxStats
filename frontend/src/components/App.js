import Styles from '../styles/App.module.scss'
import DropZone from './DropZone'
import Proceed from './Proceed'

export default () => {
    return (
        <div className={Styles.wrapper}>
            <h1 className={Styles.title}>Бросай сюда</h1>

            <div className={Styles.zonesHolder}>
                <DropZone zoneId={'newUsers'} display={'Уникальные игроки'}/>
                <DropZone zoneId={'returningUsers'} display={'Вернувшиеся игроки'}/>
                <DropZone zoneId={'sessions'} display={'Сессии'}/>
            </div>

            <Proceed/>
        </div>
    )
}