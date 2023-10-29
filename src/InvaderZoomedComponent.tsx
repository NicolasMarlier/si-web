import moment from "moment"
import "./InvaderZoomedComponent.scss"
interface Props {
    onClose: () => void
    invader: Invader
}
const InvaderZoomedComponent = (props: Props) => {
    const { invader, onClose } = props
    const {name, point, hosted_image_300_url, date_flash, date_pos, position} = invader
    return <div onClick={onClose} className="invader-zoomed">
        <img src={hosted_image_300_url} className="w-100"/>
        <div className="hover d-flex flex-column justify-content-center text-center">
            <div className="name">{ name }</div>
            <div className="score">{ point }</div>
            <div className="flashed-at">Flashé { moment(date_flash).locale("fr").format('dddd D MMMM à HH:mm') }</div>
            <div className="built-at">Posé en { moment(date_pos).format("YYYY") }</div>
        </div>
    </div>
}

export default InvaderZoomedComponent