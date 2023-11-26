import { useContext, useEffect, useState } from 'react'

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

  useEffect(() => {
    setSortedInvaders(_.sortBy(invaders, mode).reverse())
  }, [mode, invaders])

  return (
    <div className="collection-container">
      <div className="collection">
        { sortedInvaders.map(invader =>
          <InvaderComponent
            onClick={() => setCurrentInvader(invader)}
            key={invader.name}
            invader={invader}/>
        )}
      </div>
      { currentInvader && <InvaderZoomedComponent invader={currentInvader} onClose={() => setCurrentInvader(null)}/>}
      <Menu>
        <div className={`btn round ${mode=='date_pos' ? 'active' : ''}`} onClick={() => setMode("date_pos") }>
          <div className="icon trowel"></div>
          <div className="desktop-label">Ordre de pose</div>
        </div>
        <div className={`btn round ${mode=='date_flash' ? 'active' : ''}`} onClick={() => setMode("date_flash") }>
          <div className="icon flash"></div>
          <div className="desktop-label">Ordre de flash</div>
        </div>
      </Menu>
    </div>
    
  );
}

export default Collection;
