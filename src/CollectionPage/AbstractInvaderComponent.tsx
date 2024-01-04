import "./AbstractInvaderComponent.scss"

interface Props {
    abstract_invader: AbstractInvader
}
const AbstractInvaderComponent = (props: Props) => {
    const {abstract_invader: {name, kind, object}} = props
    let classes = []
    if(kind === 'hint' && (object as Hint).description.includes("DEAD")) {
        classes.push('dead')
    }
    return <div className={`abstract-invader ${kind} ${classes.join(' ')}`}>
        <div className="logo"/>
        <div className="name">{ name }</div>
    </div>
}

export default AbstractInvaderComponent