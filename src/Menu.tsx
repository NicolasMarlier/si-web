import React, { useState } from "react"


import saveButton from './save-button.png';
import invaderLogo from './invader.svg';

interface Props {
    mode: string,
    loading: boolean,
    onModeChange: (mode: string) => void,
    onClickSync: () => void,
    onClickSave: () => void,
    totalPoints: number,
    totalFlashedCount: number,
}
const Menu:React.FC<Props> = (props) => {
    const {
        mode,
        loading,
        onModeChange,
        onClickSync,
        onClickSave,
        totalPoints,
        totalFlashedCount
    } = props

    const [showMenuMobile, setShowMenuMobile] = useState(false)

    const onModeChangeEvent=(event: any) => {
        setShowMenuMobile(false)
        onModeChange(event.target.value)
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
                
                <label className={`form-control btn ${mode === "day_flash" ? "selected" : ""}`} >
                    <input type="radio" value="day_flash"  name="mode" className="btn" checked={mode === "day_flash"} onChange={onModeChangeEvent}/><span className="if-selected">&gt;&gt; </span>DANS L'ORDRE DE FLASH<span className="if-selected"> &lt;&lt;</span>
                </label>
                <label className={`form-control btn ${mode === "date_pos" ? "selected" : ""}`} >
                    <input type="radio" value="date_pos"   name="mode" className="btn" checked={mode === "date_pos"} onChange={onModeChangeEvent}/><span className="if-selected">&gt;&gt; </span>DANS L'ORDRE DE POSE<span className="if-selected"> &lt;&lt;</span>
                </label>
                <label className={`form-control btn ${mode === "by-position" ? "selected" : ""}`} >
                    <input type="radio" value="by-position"   name="mode" className="btn" checked={mode === "by-position"} onChange={onModeChangeEvent}/><span className="if-selected">&gt;&gt; </span>CARTE<span className="if-selected"> &lt;&lt;</span>
                </label>
                <label className={`form-control btn ${mode === "placing" ? "selected" : ""}`} >
                    <input type="radio" value="placing"       name="mode" className="btn" checked={mode === "placing"} onChange={onModeChangeEvent}/><span className="if-selected">&gt;&gt; </span>PLACER<span className="if-selected"> &lt;&lt;</span>
                </label>

                { false && <div className="buttons">
                    {
                        loading && <div className="btn save-button" onClick={clickSave}>
                            <img src={saveButton}/>
                        </div>
                    }
                    <div className="btn save-button" onClick={clickSync}>SYNC</div>
                </div>}
            </div>
        </div>
    )
}

export default Menu