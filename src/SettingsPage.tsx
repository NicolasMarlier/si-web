import { useContext } from "react"
import ApiClient from "./ApiClient"
import Menu from "./Menu"
import { AppContext } from "./AppProvider"
import './SettingsPage.scss'
import _ from "lodash"

const SettingsPage = () => {
    const { syncInvadersFromOfficialApi, invaders} = useContext(AppContext)
    
    const totalPoints = _.sum(_.map(invaders, "point")) + _.keys(_.groupBy(invaders, "city_id")).length * 100
    const totalFlashedCount = invaders.length

    return <div className="settings-page">
        <Menu/>
        <div className="settings-pane">
        <div className="logo-container"/>

            <div className="summary">
                <div className="p-2">{totalPoints}<div className="small">points</div></div>
                <div className="p-2">{totalFlashedCount}<div className="small">flashés</div></div>
            </div>

            <div className="btn" onClick={syncInvadersFromOfficialApi}>
                <div className="icon sync"/>
            </div>
            <div className="btn" onClick={ApiClient.logout}>
                <div className="icon logout"/>
            </div>
        </div>
    </div>
}

export default SettingsPage