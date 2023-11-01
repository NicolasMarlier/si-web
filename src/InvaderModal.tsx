import './InvaderModal.scss'
import moment from 'moment'

interface Props {
    onSave: () => void
    invader: Invader
    invaderPosition: Position
}
const InvaderModal = (props: Props) => {
    const { invader, invaderPosition, onSave } = props
    const { name, point, date_flash, date_pos } = invader

    const positionUpdated = invaderPosition !== invader.position
    

    return <div className="invader-modal">
        <div className="name">{ name.replace("_", " ") }</div>
        <div className="score">{ point }pts ({ moment(date_pos).format("YYYY") })</div>
        <div className="built-at"></div>
        <br/>
        <div className="flashed-at">Flashé { moment(date_flash).locale("fr").format('dddd D MMMM à HH:mm') }</div>

        <div className={`btn green ${positionUpdated ? '' : 'hide'}`} onClick={() => onSave()}>
            <div className="icon save"/>
        </div>
        
    </div>
}

export default InvaderModal