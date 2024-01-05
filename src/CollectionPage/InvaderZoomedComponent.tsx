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
    return <div onClick={attemptClose} className={`invader-zoomed ${classNames.join(' ')}`}>
        <div className="flex-space"/>
        <img width="1000" height="1000" src={image}/>
        <div className="flex-space"/>
        <div className="details">
            <div className="name">{ name }</div>
            <div className="score">{ point }</div>
            
            
            <div className="dates">
                { moment(date_pos).format("YYYY") } • flashé { moment(date_flash).locale("fr").format('dddd D MMMM YYYY HH:mm') }
            </div>
            
        </div>
    </div>
}

export default InvaderZoomedComponent