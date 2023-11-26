import { useContext } from "react"
import { AppContext } from "../../AppProvider"
import Permissions from '../../Permissions'

const GeoLocationRequester = () => {
    const { statusGeoLocation, fetchGeoLocation } = useContext(AppContext)
    
    const request = async() => {
        await Permissions.requestPermissionDeviceOrientation()
        fetchGeoLocation()
    }
    if(statusGeoLocation === undefined) {
        return <div className="status-box">
            Localisation: En attente...
        </div>
    }
    else if(statusGeoLocation === "active") {
        return <div className="status-box">
            Localisation: activée
        </div>
    }
    else {
        return <div className="status-box">
            <div>Localisation: { statusGeoLocation }</div>
                
            <div className="btn" onClick={request}>
                <span className="icon location"/>
                <div className="label">Demander l'accès à localisation de l'appareil</div>
            </div>
        </div>
    }
}

export default GeoLocationRequester