import Styles from '../styles/DropZone.module.scss'
import uploadIcon from '../assets/upload-icon.svg'
import { useDropzone } from 'react-dropzone'
import { useCallback, useEffect } from 'react'
import { animated, useSpring } from 'react-spring'
import { toast } from 'react-toastify'
import { useDataContext } from '../contexts/DataContext'
import { parse } from 'papaparse'

export default ({ zoneId, display }) => {
    const dataContext = useDataContext()

    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.forEach((file) => {
            if (file.type != 'text/csv') return toast.error('Только файлы .csv!');
            const reader = new FileReader();
            reader.onload = () => {
                const text = reader.result;
                parse(text, {
                    header: true,
                    complete: (results) => {
                        dataContext.setData(zoneId, results.data);
                    }
                });
            };

            reader.readAsText(file);
        });
    })

    const { getRootProps, isDragActive } = useDropzone({ onDrop })

    const zoneAnimation = useSpring({
        to: {
            scale: isDragActive ? 1.05 : 1,

            border: dataContext.csvData[zoneId] ? (!isDragActive ? '2px solid rgba(0, 255, 0, .5)' : '2px solid rgba(0, 0, 0, .5)') : '2px solid rgba(0, 0, 0, .5)'
        }
    })

    const titleAnimation = useSpring({
        from: {
            bottom: '0em',
            opacity: 0,
        },

        to: {
            bottom: isDragActive ? '-2em' : '0em',
            opacity: isDragActive ? 1 : 0,
            
        }
    })

    return (
        <animated.div style={zoneAnimation} {...getRootProps()} className={Styles.dropZone}>
            <img className={Styles.dropIcon} src={uploadIcon} />
            <animated.p style={titleAnimation} className={Styles.dropTitle}>{display}</animated.p>
        </animated.div>
    )
}