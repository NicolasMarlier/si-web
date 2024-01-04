import "./InvaderComponent.scss"

interface Props {
    invader: Invader,
    onClick: () => void
}

const InvaderComponent= (props: Props) => {
    const {invader: {hosted_image_300_url, position}, onClick} = props
    return <div className="invader" onClick={onClick}>
        <img src={hosted_image_300_url} className="w-100"/>
        { !position && <div className="unknown-position-indicator"></div>}
    </div>
}

export default InvaderComponent