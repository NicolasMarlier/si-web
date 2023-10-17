import { createContext, useState } from 'react';
import ApiClient from "./ApiClient"

export const HintsContext = createContext(null as any);

export const HintsProvider = ({ children }: any) => {
    const [hints, setHints] = useState([] as Hint[])
    const [loadingHints, setLoadingHints] = useState(true)
    
    const fetchHints = () => {
        setLoadingHints(true)
        ApiClient.listHints().then(hints => {
            setLoadingHints(false)
            setHints(hints)
        })
    }

    const deleteHint = (hint: Hint) => {
        setLoadingHints(true)
        if(hint.id) {
            ApiClient.deleteHint(hint.id).then(fetchHints)
        }
    }
 
    return (
        <HintsContext.Provider value={{ hints, fetchHints, deleteHint, loadingHints, setLoadingHints }}>
            {children}
        </HintsContext.Provider>
    )
}