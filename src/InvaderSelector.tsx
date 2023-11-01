import React from "react";
import "./InvaderSelector.css"

const InvaderSelector:React.FC<{onSelect: (invader: Invader) => void, invaders: Invader[]}> = (props) => {
    const {invaders, onSelect} = props
    return <div className="invader-selector">
        { invaders.map(invader => 
            <div
                key={invader.name}
                onClick={() => onSelect(invader)}>
                <img src={invader.hosted_image_300_url} className="w-100"/>
            </div>
        )}
    </div>
}

export default InvaderSelector