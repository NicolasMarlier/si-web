import { useEffect, useState } from 'react'
import './HintModal.scss'

interface Props {
    onUpdateDescription: (description: string) => void
    hint: Hint
}
const HintModal = (props: Props) => {
    const { hint, onUpdateDescription } = props
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
        <input
            autoFocus={id === undefined}
            value={ currentDescription }
            onChange={(e) => setCurrentDescription(e.currentTarget.value)}
            onBlur={() => onUpdateDescription(currentDescription)}
            onKeyDown={onKeyDown}
            />
        
    </div>
}

export default HintModal