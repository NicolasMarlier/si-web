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
            Orientation de l'appareil: en attente...
        </div>
    }
    else if(statusDeviceOrientation === "active") {
        return <div className="status-box">
            Orientation de l'appareil: activée
        </div>
    }
    else {
        return <div className="status-box">
            <div>Orientation de l'appareil: { statusDeviceOrientation }</div>
                
            <div className="btn" onClick={request}>
                <span className="icon compass"/>
                <div className="label">Demander l'orientation de l'appareil</div>
            </div>
        </div>
    }
}

export default DeviceOrientationRequester