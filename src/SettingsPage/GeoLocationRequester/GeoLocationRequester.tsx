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
            GeoLocation: pending...
        </div>
    }
    else if(statusGeoLocation === "active") {
        return <div className="status-box">
            GeoLocation: active
        </div>
    }
    else {
        return <div className="status-box">
            <div>GeoLocation: { statusGeoLocation }</div>
                
            <div className="btn" onClick={request}>
                <span className="icon location"/>
                <div className="label">Request GeoLocation</div>
            </div>
        </div>
    }
}

export default GeoLocationRequester