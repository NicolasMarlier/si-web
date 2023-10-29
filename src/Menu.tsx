import React, { useContext, useState } from "react"


import saveButton from './save-button.png'
import invaderLogo from './invader.svg'
import { NavLink } from 'react-router-dom'
import ApiClient from './ApiClient'
import { AppContext } from "./AppProvider"
import _ from "lodash"
import mapIcon from './icons/map.svg'


const Menu = () => {
    const { loading, invaders, syncInvadersFromOfficialApi, newHint, currentGeoLocation } = useContext(AppContext)

    const totalPoints = _.sum(_.map(invaders, "point")) + _.keys(_.groupBy(invaders, "city_id")).length * 100
    const totalFlashedCount = invaders.length

    const [showMenuMobile, setShowMenuMobile] = useState(false)

    const onClickNav=() => {
        setShowMenuMobile(false)
    }

    const toggleMenu = () => {
        setShowMenuMobile(!showMenuMobile)
    }

    const clickSync = () => {
        setShowMenuMobile(false)
        syncInvadersFromOfficialApi()
    }

    return (
        <div className="menu">
            <div className="menu-container">
                <div className="logo-container"/>

                <div className="summary">
                    <div className="p-2">{totalPoints}<div className="small">points</div></div>
                    <div className="p-2">{totalFlashedCount}<div className="small">flashés</div></div>
                </div>
                
                <NavLink
                    to="/collection"
                    className="btn"
                    onClick={onClickNav}>
                        <div className="icon collection"/>
                </NavLink>
                <NavLink
                    to="/map"
                    className="btn"
                    onClick={onClickNav}>
                        <div className="icon map"/>
                </NavLink>
                
                {/* <NavLink
                    to="/place"
                    className="btn no-mobile"
                    onClick={onClickNav}>
                        &gt;&gt; PLACE &lt;&lt;
                </NavLink>

                <NavLink
                    to="/place-hint"
                    className="btn no-mobile"
                    onClick={onClickNav}>
                        &gt;&gt; PLACE HINT &lt;&lt;
                </NavLink> */}

                <div className="btn" onClick={() => newHint(currentGeoLocation)}>
                    <div className="icon new-hint"/>
                </div>

                <div className="btn" onClick={ApiClient.logout}>
                    <div className="icon logout"/>
                </div>

                <div className="btn" onClick={clickSync}>
                    <div className="icon sync"/>
                </div>

            </div>
        </div>
    )
}

export default Menu