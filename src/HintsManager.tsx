import { useContext, useEffect, useState } from "react"
import HintsList from "./HintsList"
import ApiClient from "./ApiClient"
import { HintsContext } from "./HintsProvider"

interface Props {
    currentPosition: Position
}
const HintsManager = (props: Props) => {
    const { currentPosition } = props 
    const { hints, fetchHints, deleteHint, loadingHints, setLoadingHints } = useContext(HintsContext);

    const addHint = () => {
        setLoadingHints(true)
        ApiClient.insertHint({
            description: "Bla",
            position: currentPosition,
            placed_at: (new Date()).toString()
        }).then(fetchHints)
    }

    useEffect(fetchHints, [])

    return <div>
        <div onClick={addHint}>Add hint</div>
    </div>
}

export default HintsManager