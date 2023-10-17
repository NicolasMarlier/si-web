interface Props {
    hint: Hint,
    onDelete: () => void
}
const HintItem = (props: Props) => {
    const { hint: {description, position, placed_at, id}, onDelete } = props
    return <div>
        <span>{ id }</span>
        <span>{ description }</span>
        <span>{ placed_at }</span>
        <span>{ position.lat }/{ position.lng }</span>
        <span onClick={onDelete}>DELETE</span>
    </div>
}

export default HintItem