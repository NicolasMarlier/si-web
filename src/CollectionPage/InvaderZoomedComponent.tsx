import moment from "moment"
import "./InvaderZoomedComponent.scss"
import { useEffect, useState } from "react"
interface Props {
    onClose: () => void
    invader: Invader
}
const InvaderZoomedComponent = (props: Props) => {
    const { invader, onClose } = props
    const {name, point, image, date_flash, date_pos} = invader
    const [classNames, setClassNames] = useState([] as string[])

    useEffect(() => {
        setTimeout(() => {
            setClassNames(['visible'])
        }, 10)
    }, [])

    const attemptClose = () => {
        setClassNames([])
        setTimeout(onClose, 300)
    }
    const capitalize = (str: string) =>  str.charAt(0).toUpperCase() + str.slice(1)

    return <div onClick={attemptClose} className={`invader-zoomed ${classNames.join(' ')}`}>
        <div className="flex-space"/>
        <img width="1000" height="1000" src={image}/>
        <div className="flex-space"/>
        <div className="details">
            <div className="line">
                <label>Nom</label>
                <div className="value-container">
                    . . . . . . . . . . . . . . . .
                    <div className="value">{ name }</div>
                </div>
            </div>
            <div className="line">
                <label>Points</label>
                <div className="value-container">
                    . . . . . . . . . . . . . . . .
                    <div className="value">{ point }</div>
                </div>
            </div>
            <div className="line">
                <label>Posé</label>
                <div className="value-container">
                    . . . . . . . . . . . . . . . .
                    <div className="value">{ moment(date_pos).format("YYYY") }</div>
                </div>
            </div>
            <div className="line">
                <label>Flashé</label>
                <div className="value-container">
                    . . . . . . . . . . . . . . . .
                    <div className="value value-small">{ capitalize(moment(date_flash).locale("fr").format('dddd DD/MM/YY, HH:mm')) }</div>
                </div>
            </div>        
        </div>
    </div>
}

export default InvaderZoomedComponent