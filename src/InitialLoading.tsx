import { useContext } from 'react'
import './InitialLoading.scss'
import { AppContext } from './AppProvider'
import loadingGif from './icons/loading.gif'

const InitialLoading = () => {
    const { status } = useContext(AppContext)
    
    return <div className="loading-container">
        <img src={loadingGif}/>
        <div className="main-message">CHARGEMENT...</div>
        { status }
    </div>
}

export default InitialLoading