import Styles from '../styles/DropZone.module.scss'
import uploadIcon from '../assets/upload-icon.svg'
import { useDropzone } from 'react-dropzone'
import { useCallback, useEffect, useState } from 'react'
import { animated, useSpring } from 'react-spring'
import { toast } from 'react-toastify'
import { useDataContext } from '../contexts/DataContext'
import { parse } from 'papaparse'
import newUsersValidator from '../validators/newUsersValidator'
import sessionsValidator from '../validators/sessionsValidator'
import returningUsersValidator from '../validators/returningUsersValidator'

//validators

const validators = {
    newUsers: newUsersValidator,
    sessions: sessionsValidator,
    returningUsers: returningUsersValidator
}

export default ({ zoneId, display }) => {
    const dataContext = useDataContext()
    const [triggered, setTriggered] = useState(0) // 0 -- no trigger, 1 - error, 2 - success

    const onDrop = useCallback(acceptedFiles => {
        dataContext.setData(zoneId, null)

        acceptedFiles.forEach((file) => {
            if (file.type != 'text/csv') return toast.error('Только файлы .csv!')
            const reader = new FileReader()
            reader.onload = () => {
                const text = reader.result.split('\n').slice(2).join('\n')
                parse(text, {
                    header: true,
                    complete: (results) => {
                        if (!validators[zoneId](results.data)) {
                            setTriggered(1) 
                            return toast.error('.csv должно быть валидным!')
                        }

                        setTriggered(2)
                        dataContext.setData(zoneId, results.data);
                    }
                });
            };

            reader.readAsText(file)
        });
    })

    const { getRootProps, isDragActive } = useDropzone({ onDrop })
    
    const zoneAnimation = useSpring({
        to: {
            scale: isDragActive ? 1.05 : 1,
            border: dataContext.csvData[zoneId] ? (!isDragActive ? '2px solid rgba(0, 255, 0, .5)' : '2px solid rgba(0, 0, 0, .5)') : '2px solid rgba(0, 0, 0, .5)'
        },
    })

    const titleAnimation = useSpring({
        from: {
            bottom: '0em',
            opacity: 0,
        },

        to: {
            bottom: (isDragActive || dataContext.csvData[zoneId]) ? '-2em' : '0em',
            opacity: (isDragActive || dataContext.csvData[zoneId]) ? 1 : 0,
            color: triggered == 1 ? 'rgb(212, 25, 25)' : (triggered == 2 ? 'rgba(0, 255, 0, .7)' : 'rgb(0, 0, 0)')
        },

        onRest: () => {
            setTriggered(0)
        }
    })

    return (
        <animated.div style={zoneAnimation} {...getRootProps()} className={Styles.dropZone}>
            <img className={Styles.dropIcon} src={uploadIcon} />
            <animated.p style={titleAnimation} className={Styles.dropTitle}>{display}</animated.p>
        </animated.div>
    )
}