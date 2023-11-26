import { useContext } from "react"
import { AppContext } from "../../AppProvider"
import Permissions from '../../Permissions'

const DeviceOrientationRequester = () => {
    const { statusDeviceOrientation } = useContext(AppContext)
    
    const request = async() => {
        await Permissions.requestPermissionDeviceOrientation()
    }

    if(statusDeviceOrientation === undefined) {
        return <div className="status-box">
            Boussole: en attente...
        </div>
    }
    else if(statusDeviceOrientation === "active") {
        return <div className="status-box">
            Boussole: activée
        </div>
    }
    else {
        return <div className="status-box">
            <div>Boussole: { statusDeviceOrientation }</div>
                
            <div className="btn" onClick={request}>
                <span className="icon compass"/>
                <div className="label">Demander l'accès à la boussole</div>
            </div>
        </div>
    }
}

export default DeviceOrientationRequester