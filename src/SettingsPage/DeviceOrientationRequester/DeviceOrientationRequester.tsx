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
            Device orientation: pending...
        </div>
    }
    else if(statusDeviceOrientation === "active") {
        return <div className="status-box">
            Device orientation: active
        </div>
    }
    else {
        return <div className="status-box">
            <div>Device orientation: { statusDeviceOrientation }</div>
                
            <div className="btn" onClick={request}>
                <span className="icon compass"/>
                <div className="label">Request Device Orientation</div>
            </div>
        </div>
    }
}

export default DeviceOrientationRequester