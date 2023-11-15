import { useContext } from 'react'
import './InitialLoading.scss'
import { AppContext } from './AppProvider'
import loadingGif from './icons/loading.gif'
const InitialLoading = () => {
    const { loadingLocation, loading, loadingMap, status, fetchPermissions } = useContext(AppContext)
    
    return <div className="loading-container">
        <img src={loadingGif}/>
        <div className="main-message">LOADING</div>
        { loadingLocation && "Locating you..."}
        { loading && "Getting invaders..."}
        { status }
    </div>
}

export default InitialLoading