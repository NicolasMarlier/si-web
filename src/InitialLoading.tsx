import { useContext } from 'react'
import './InitialLoading.scss'
import { AppContext } from './AppProvider'

const InitialLoading = () => {
    const { loadingLocation, loading, loadingMap } = useContext(AppContext)
    
    return <div className="loading-container">
        <div>Loading...</div>
        { loadingLocation && "Locating you..."}
        { loading && "Getting invaders..."}
        { loadingMap && "Loading map..."}
    </div>
}

export default InitialLoading