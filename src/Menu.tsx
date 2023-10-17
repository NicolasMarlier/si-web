import React, { useState } from "react"


import saveButton from './save-button.png'
import invaderLogo from './invader.svg'
import { NavLink } from 'react-router-dom'
import ApiClient from './ApiClient'

interface Props {
    loading: boolean,
    onClickSync: () => void,
    onClickSave: () => void,
    totalPoints: number,
    totalFlashedCount: number,
}
const Menu:React.FC<Props> = (props) => {
    const {
        loading,
        onClickSync,
        onClickSave,
        totalPoints,
        totalFlashedCount
    } = props

    const [showMenuMobile, setShowMenuMobile] = useState(false)

    const onClickNav=() => {
        setShowMenuMobile(false)
    }

    const toggleMenu = () => {
        setShowMenuMobile(!showMenuMobile)
    }

    const clickSync = () => {
        setShowMenuMobile(false)
        onClickSync()
    }

    const clickSave = () => {
        setShowMenuMobile(false)
        onClickSave()
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
                    {
                        loading && <div className="btn save-button" onClick={clickSave}>
                            <img src={saveButton}/>
                        </div>
                    }
                    <div className="btn save-button" onClick={ApiClient.logout}>LOGOUT</div>
                    <div className="btn save-button" onClick={clickSync}>SYNC</div>
                </div>
            </div>
        </div>
    )
}

export default Menu