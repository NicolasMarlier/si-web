import React, { useContext, useState } from "react"


import saveButton from './save-button.png'
import invaderLogo from './invader.svg'
import { NavLink } from 'react-router-dom'
import ApiClient from './ApiClient'
import { AppContext } from "./AppProvider"
import _ from "lodash"


const Menu = () => {
    const { loading, invaders, syncInvadersFromOfficialApi } = useContext(AppContext)

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
            <div className="menu-toggle-button"
                onClick={toggleMenu}>≡</div>
            <div className={`menu-container ${showMenuMobile ? 'show' : ''}`}>
                <div className="logo-container">
                    <img src={invaderLogo}/>
                </div>

                <div className="summary d-flex flex-row justify-content-center">
                    <div className="p-2">{totalPoints}<span className="small"> pts</span></div>
                    <div className="p-2">{totalFlashedCount}<span className="small"> flashés</span></div>
                </div>
                
                <NavLink
                    to="/collection"
                    className="btn"
                    onClick={onClickNav}>
                        &gt;&gt; COLLECTION &lt;&lt;
                </NavLink>
                <NavLink
                    to="/map"
                    className="btn"
                    onClick={onClickNav}>
                        &gt;&gt; CARTE &lt;&lt;
                </NavLink>
                <NavLink
                    to="/place"
                    className="btn"
                    onClick={onClickNav}>
                        &gt;&gt; PLACE &lt;&lt;
                </NavLink>

                <NavLink
                    to="/place-hint"
                    className="btn"
                    onClick={onClickNav}>
                        &gt;&gt; PLACE HINT &lt;&lt;
                </NavLink>

                <div className="buttons">
                    <div className="btn save-button" onClick={ApiClient.logout}>LOGOUT</div>
                    <div className="btn save-button" onClick={clickSync}>SYNC</div>
                    { loading && <div>Loading...</div>}
                </div>
            </div>
        </div>
    )
}

export default Menu