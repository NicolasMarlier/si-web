import moment from "moment"
import "./InvaderZoomedComponent.scss"
interface Props {
    onClose: () => void
    invader: Invader
}
const InvaderZoomedComponent = (props: Props) => {
    const { invader, onClose } = props
    const {name, point, image, date_flash, date_pos, position} = invader
    return <div onClick={onClose} className="invader-zoomed">
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