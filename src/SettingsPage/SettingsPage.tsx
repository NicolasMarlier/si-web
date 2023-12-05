import { useContext } from "react"
import ApiClient from "../ApiClient"
import Menu from "../Menu"
import { AppContext } from "../AppProvider"
import './SettingsPage.scss'
import _ from "lodash"
import GeoLocationRequester from "./GeoLocationRequester/GeoLocationRequester"
import DeviceOrientationRequester from "./DeviceOrientationRequester/DeviceOrientationRequester"

const SettingsPage = () => {
    return <div className="settings-page">
        <Menu>
            <div className="btn" onClick={ApiClient.logout}>
                <div className="icon logout"/>
                <div className="desktop-label">Déconnection</div>
            </div>
        </Menu>
        <div className="settings-pane">
        <div className="logo-container"/>
            <GeoLocationRequester/>
            <DeviceOrientationRequester/>
        </div>
    </div>
}

export default SettingsPage