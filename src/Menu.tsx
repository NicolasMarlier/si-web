import { useContext, useState, PropsWithChildren} from "react"



import { NavLink } from 'react-router-dom'
import ApiClient from './ApiClient'
import { AppContext } from "./AppProvider"
import _ from "lodash"


const Menu = (props: PropsWithChildren) => {
    const { children } = props
    const { loading, invaders, syncInvadersFromOfficialApi, newHint, currentGeoLocation } = useContext(AppContext)

    return (
        <div className="menu">
            <div className="menu-container">
                

                <div className="nav-items">
                    <NavLink
                        to="/settings"
                        className="btn">
                            <div className="icon settings"/>
                    </NavLink>
                    
                    <NavLink
                        to="/collection"
                        className="btn">
                            <div className="icon collection"/>
                    </NavLink>
                    <NavLink
                        to="/map"
                        className="btn">
                            <div className="icon map"/>
                    </NavLink>
                    <NavLink
                        to="/place"
                        className="btn no-mobile">
                            <div className="icon marker"/>
                    </NavLink>
                </div>
                <div className="action-items">
                    { children }
                </div>
            </div>
        </div>
    )
}

export default Menu