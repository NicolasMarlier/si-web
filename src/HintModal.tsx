import { useEffect, useState } from 'react'
import './HintModal.scss'

interface Props {
    onDelete: () => void
    onUpdateDescription: (description: string) => void
    hint: Hint
}
const HintModal = (props: Props) => {
    const { hint, onDelete, onUpdateDescription } = props
    const { description } = hint
    const [currentDescription, setCurrentDescription] = useState(description)

    useEffect(() => {
        setCurrentDescription(description)
    },[description])

    const descriptionUpdated = currentDescription != description
    

    return <div className="hint-modal">
        <div className="btn red" onClick={onDelete}>
            <div className="icon delete"/>
        </div>
        <input
            value={ currentDescription }
            onChange={(e) => setCurrentDescription(e.currentTarget.value)}
            />
        <div className={`btn green ${descriptionUpdated ? '' : 'hide'}`} onClick={() => onUpdateDescription(currentDescription)}>
            <div className="icon save"/>
        </div>
        
    </div>
}

export default HintModal