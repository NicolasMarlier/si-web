import { useContext, PropsWithChildren} from "react"

import { NavLink } from 'react-router-dom'
import { AppContext } from "./AppProvider"
import loadingGif from './icons/loading.gif'


const Menu = (props: PropsWithChildren) => {
    const { children } = props
    const { loading } = useContext(AppContext)

    return (
        <div className="menu">
            <div className="menu-container">
                <div className="nav-items">
                    <NavLink
                        to="/map"
                        className="btn">
                            <div className="icon map"/>
                            <div className="desktop-label">Carte</div>
                    </NavLink>
                    <NavLink
                        to="/collection"
                        className="btn">
                            <div className="icon collection"/>
                            <div className="desktop-label">Collection</div>
                    </NavLink>
                    <NavLink
                        to="/place"
                        className="btn no-mobile">
                            <div className="icon marker"/>
                            <div className="desktop-label">Positionner</div>
                    </NavLink>
                    <NavLink
                        to="/settings"
                        className="btn">
                            <div className="icon settings"/>
                            <div className="desktop-label">Stats & Réglages</div>
                    </NavLink>
                    { loading && <img className="loading" src={loadingGif}/>}
                </div>
                <div className="action-items">
                    { children }
                </div>
            </div>
        </div>
    )
}

export default Menu