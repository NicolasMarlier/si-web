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

    return <div className="hint-modal">
        <input
            value={ currentDescription }
            onChange={(e) => setCurrentDescription(e.currentTarget.value)}
            />
        <div className="btn" onClick={() => onUpdateDescription(currentDescription)}>save</div>
        <div className="btn" onClick={onDelete}>DELETE</div>
    </div>
}

export default HintModal