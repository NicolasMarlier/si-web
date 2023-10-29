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
        <img width="1000" height="1000" src={image}/>
        <div className="details">
            <div className="name">{ name.replace("_", " ") }</div>
            <div className="score">{ point } points</div>
            <div className="built-at">Posé en { moment(date_pos).format("YYYY") }</div>
            <br/>
            <div className="flashed-at">Flashé { moment(date_flash).locale("fr").format('dddd D MMMM à HH:mm') }</div>
            
        </div>
    </div>
}

export default InvaderZoomedComponent