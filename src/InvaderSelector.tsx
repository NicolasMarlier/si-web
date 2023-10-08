import React from "react";
import "./InvaderSelector.css"

const InvaderSelector:React.FC<{onSelect: (invader: Invader) => void, invaders: Invader[], selectedInvader: Invader | undefined}> = (props) => {
    const {invaders, onSelect, selectedInvader} = props
    return <div className="invader-selector">
        { invaders.map(invader => 
            <div className={selectedInvader && selectedInvader.name === invader.name ? "selected" : ""}
                key={invader.name}
                onClick={() => onSelect(invader)}>
                <img src={invader.hosted_image_300_url} className="w-100"/>
            </div>
        )}
    </div>
}

export default InvaderSelector