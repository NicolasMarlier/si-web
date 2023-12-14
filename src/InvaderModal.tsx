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
        
        { !positionUpdated && <>
            <div className="built-at">{ moment(date_pos).format("YYYY") }</div>
            <div className="name">{ name }</div>
            <div className="score">{ point }</div>
            
            <div className="flashed-at">Flashé { moment(date_flash).locale("fr").format('dddd D MMMM à HH:mm') }</div>
        </>}

        { positionUpdated && <div className="btn" onClick={() => onSave()}>
            <div className="icon save"/>
            <div className="desktop-label">Mettre à jour la position</div>
        </div>}
        
    </div>
}

export default InvaderModal