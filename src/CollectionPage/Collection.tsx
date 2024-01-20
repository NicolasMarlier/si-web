import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import _ from "lodash"
import InvaderComponent from './InvaderComponent';
import "./Collection.scss"
import { AppContext } from '../AppProvider';
import InvaderZoomedComponent from './InvaderZoomedComponent';
import Menu from "../Menu"
import AbstractInvaderComponent from './AbstractInvaderComponent';

type Mode = "date_pos" | "date_flash"

const Collection = () => {
  const { invaders, cities } = useContext(AppContext)
  const [mode, setMode] = useState("date_flash" as Mode)
  const [currentInvader, setCurrentInvader] = useState(null as Invader | null)
  const [abstractInvadersToDisplay, setAbstractInvadersToDisplay] = useState([] as AbstractInvader[])

  const navigate = useNavigate()
  const { invader_name } = useParams()

  useEffect(() => {
    setCurrentInvader(_.find(invaders, {name: invader_name}) || null)
  }, [invader_name])

  useEffect(() => {
    // invadersAsDict = invaders.
    // setSearchables(
    //   _.flatten(
    //     cities.map(city => {
    //       _.range(1, city.invaders_count).map(index => {
    //         invaders.find()
    //       })
    //     })
    //   )

      // [
      // ...invaders.map(invader => ({
      //   kind: 'invader',
      //   invader_name: invader.name,
      //   value: invader
      // }))
    // )
  }, [cities])  

  const cityOrder = (citySlug: string) => {
    return {
      'PA': 'AA',
      'RN': 'AB',
      'VLMO': 'AC',
      'NA': 'AD'
    }[citySlug] || citySlug
  }

  useEffect(() => {
    if(mode === "date_pos") {
        setAbstractInvadersToDisplay(
          _.sortBy(
            _.flatten(_.map(cities, 'abstract_invaders')),
            (abstract_invader) => [cityOrder(abstract_invader.name.split("_")[0]), abstract_invader.name.split("_")[1].padStart(8)].join('_')
          )
        )
    }
    else if(mode === "date_flash") {
      setAbstractInvadersToDisplay(
          _.reverse(
            _.sortBy(
              _.filter(
                _.flatten(_.map(cities, 'abstract_invaders')),
                {kind: 'invader'}
              ),
              (abstract_invader) => abstract_invader.object.date_flash)
          )
      )
    }
  }, [mode, cities])

  useEffect(() => {
    console.log(abstractInvadersToDisplay)
  }, [abstractInvadersToDisplay])

  const showSearchModal = (e: React.MouseEvent) => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', { code: 'KeyF'})
    )
  }

  const component = (abstract_invader: AbstractInvader) => {
    const {kind, name, object} = abstract_invader
    switch(kind) {
      case 'invader':
        const invader = object as Invader
        return <InvaderComponent
          onClick={() => navigate(`/collection/${invader.name}`)}
          key={name}
          invader={invader}/>
      default:
        return <AbstractInvaderComponent
          key={name}
          abstract_invader={abstract_invader}/>
    }
  }

  return (
    <div className="collection-container">
      <div className="collection">
        { abstractInvadersToDisplay.map(abstract_invader => component(abstract_invader)) }
      </div>
      { currentInvader && <InvaderZoomedComponent invader={currentInvader} onClose={() => navigate("/collection")}/>}
      <Menu>
      { <>
          <div className={`btn round ${mode=='date_pos' ? 'active' : ''} ${currentInvader ? 'hidden' : ''}`} onClick={() => setMode("date_pos") }>
            <div className="icon trowel"></div>
            <div className="desktop-label">Ordre de pose</div>
          </div>
          <div className={`btn round ${mode=='date_flash' ? 'active' : ''} ${currentInvader ? 'hidden' : ''}`} onClick={() => setMode("date_flash") }>
            <div className="icon flash"></div>
            <div className="desktop-label">Ordre de flash</div>
          </div>
          <div className={`btn round ${currentInvader ? 'hidden' : ''}`} onClick={ showSearchModal }>
            <div className="icon magnifying-glass"></div>
            <div className="desktop-label">Search</div>
          </div>
        </> }
      </Menu>
    </div>
    
  );
}

export default Collection;
