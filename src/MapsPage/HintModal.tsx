import { useEffect, useState } from 'react'
import './HintModal.scss'

interface Props {
    onDelete: () => void
    onUpdateDescription: (description: string) => void
    hint: Hint
}
const HintModal = (props: Props) => {
    const { hint, onDelete, onUpdateDescription } = props
    const { description, id } = hint
    const [currentDescription, setCurrentDescription] = useState(description)

    useEffect(() => {
        setCurrentDescription(description)
    },[description])

    const onKeyDown = (e: React.KeyboardEvent) => {
        if(e.code == "Enter") {
            e.stopPropagation()
            onUpdateDescription(currentDescription)
        }
    }

    const descriptionUpdated = currentDescription !== description
    

    return <div className="hint-modal">
        <div className="btn" onClick={onDelete}>
            <div className="icon delete"/>
        </div>
        <input
            autoFocus={id === undefined}
            value={ currentDescription }
            onChange={(e) => setCurrentDescription(e.currentTarget.value)}
            onKeyDown={onKeyDown}
            />
        <div className={`btn ${descriptionUpdated ? '' : 'hide'}`} onClick={() => onUpdateDescription(currentDescription)}>
            <div className="icon save"/>
        </div>
        
    </div>
}

export default HintModal