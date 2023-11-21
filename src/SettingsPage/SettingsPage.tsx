import { useContext } from "react"
import ApiClient from "../ApiClient"
import Menu from "../Menu"
import { AppContext } from "../AppProvider"
import './SettingsPage.scss'
import _ from "lodash"
import Permissions from '../Permissions'
import GeoLocationRequester from "./GeoLocationRequester/GeoLocationRequester"
import DeviceOrientationRequester from "./DeviceOrientationRequester/DeviceOrientationRequester"

const SettingsPage = () => {
    const { syncInvadersFromOfficialApi, invaders, status } = useContext(AppContext)
    
    const totalPoints = _.sum(_.map(invaders, "point")) + _.keys(_.groupBy(invaders, "city_id")).length * 100
    const totalFlashedCount = invaders.length

    return <div className="settings-page">
        <Menu>
            <div className="btn" onClick={ApiClient.logout}>
                <div className="icon logout"/>
            </div>
        </Menu>
        <div className="settings-pane">
        <div className="logo-container"/>
            <div className="summary">
                <div className="p-2">{totalPoints}<div className="small">points</div></div>
                <div className="p-2">{totalFlashedCount}<div className="small">flashés</div></div>
            </div>

            <GeoLocationRequester/>
            <DeviceOrientationRequester/>
        </div>
    </div>
}

export default SettingsPage