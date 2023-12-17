import React from "react";
import "./InvaderSelector.scss"
import _ from "lodash";

interface Props {
    onSelect: (invader: Invader) => void
    onSelectHint: (hint: Hint) => void
    invaders: Invader[]
    hints: Hint[]
}
const InvaderSelector:React.FC<Props> = (props) => {
    const {invaders, hints, onSelect, onSelectHint} = props
    return <div id="invaders-selector">
        { _.sortBy(invaders, 'date_flash').map(invader => {
            
            const matchingHint = _.find(hints, (h) => h.description.replace("-", "_").includes(invader.name))
            return <div
                className="invader-selector"
                key={invader.name}
                >
                <img src={invader.hosted_image_300_url} className="w-100"
                    onClick={() => onSelect(invader)}/>
                { matchingHint && <div className="matching-hint" onClick={() => onSelectHint(matchingHint)}/>}
            </div>
        }
        )}
    </div>
}

export default InvaderSelector