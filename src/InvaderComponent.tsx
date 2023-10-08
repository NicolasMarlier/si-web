import React from "react"
import "./InvaderComponent.css"
import moment from "moment"

const InvaderComponent: React.FC<{invader: Invader, onClick: () => void}> = (props) => {
    const {invader: {name, point, hosted_image_300_url, date_flash, date_pos, position}, onClick} = props
    return <div className="invader w-25" onClick={onClick}>
        <img src={hosted_image_300_url} className="w-100"/>
        <div className="hover d-flex flex-column justify-content-center text-center">
            <div className="name">{ name }</div>
            <div className="score">{ point }</div>
            <div className="flashed-at">Flashé { moment(date_flash).locale("fr").format('dddd D MMMM à HH:mm') }</div>
            <div className="built-at">Posé en { moment(date_pos).format("YYYY") }</div>
        </div>
        { !position && <div className="unknown-position-indicator">?</div>}
    </div>
}

export default InvaderComponent