import HintItem from "./HintItem"

interface Props {
    hints: Hint[]
    onDelete: (hint: Hint) => void
}
const HintsList = (props: Props) => {
    const { hints, onDelete } = props
    return <div>
        { hints.map(hint => <HintItem hint={hint} onDelete={() => onDelete(hint)}/>)}
    </div>
}

export default HintsList