import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import _ from "lodash"
import InvaderComponent from './InvaderComponent';
import "./Collection.scss"
import { AppContext } from '../AppProvider';
import InvaderZoomedComponent from './InvaderZoomedComponent';
import Menu from "../Menu"

type Mode = "date_pos" | "date_flash"

const Collection = () => {
  const { invaders } = useContext(AppContext)
  const [sortedInvaders, setSortedInvaders] = useState([] as Invader[])
  const [mode, setMode] = useState("date_flash" as Mode)
  const [currentInvader, setCurrentInvader] = useState(null as Invader | null)

  const navigate = useNavigate()
  const { invader_name } = useParams()

  useEffect(() => {
    setCurrentInvader(_.find(invaders, {name: invader_name}) || null)
  }, [invader_name])

  useEffect(() => {
    setSortedInvaders(_.sortBy(invaders, mode).reverse())
  }, [mode, invaders])

  const showSearchModal = (e: React.MouseEvent) => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'KeyF'})
    )
  }

  return (
    <div className="collection-container">
      <div className="collection">
        { sortedInvaders.map(invader =>
          <InvaderComponent
            onClick={() => navigate(`/collection/${invader.name}`)}
            key={invader.name}
            invader={invader}/>
        )}
      </div>
      { currentInvader && <InvaderZoomedComponent invader={currentInvader} onClose={() => navigate("/collection")}/>}
      <Menu>
      { currentInvader === null && <>
        <div className={`btn round ${mode=='date_pos' ? 'active' : ''}`} onClick={() => setMode("date_pos") }>
          <div className="icon trowel"></div>
          <div className="desktop-label">Ordre de pose</div>
        </div>
        <div className={`btn round ${mode=='date_flash' ? 'active' : ''}`} onClick={() => setMode("date_flash") }>
          <div className="icon flash"></div>
          <div className="desktop-label">Ordre de flash</div>
        </div>
        <div className='btn round' onClick={ showSearchModal }>
          <div className="icon magnifying-glass"></div>
          <div className="desktop-label">Search</div>
        </div>
        </> }
      </Menu>
    </div>
    
  );
}

export default Collection;
