import React, { useEffect, useState } from 'react'

import _ from "lodash"
import moment from "moment"
import "moment/locale/fr"
import './App.scss';
import './Menu.scss';
import apiClient from './ApiClient'
import InvaderComponent from './InvaderComponent';
import InvaderSelector from './InvaderSelector'
import Map from "./Map"
import Menu from "./Menu"

const App:React.FC = () => {
  const [invaders, setInvaders] = useState([] as Invader[])
  const [pendingUpdates, setPendingUpdates] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(undefined as Position | undefined)
  const [mode, setMode] = useState("day_flash" as string)
  useEffect(() => {
    apiClient.listInvaders().then(setInvaders)
  }, [])

  const moveInvader = (invader: Invader, position: Position | undefined) => {
    apiClient.saveInvader(
      invaders,
      {
        ...invader,
        ...{position}
      }
    ).then((invaders) => {
      setInvaders(invaders)
      setPendingUpdates(true)
    })
  }

  const saveInvaders = () => {
    setPendingUpdates(false)
    apiClient.saveInvaders(invaders)
  }

  const syncInvaders = async() => {
    await apiClient.syncInvaders()
    return apiClient.listInvaders().then(setInvaders)
  }

  const sortedInvaderGroups = () => {
    if(mode === "day_flash") {
      return _.orderBy(
        _.map(
          _.groupBy(invaders, ({date_flash}) => date_flash.substring(0, 10)),
          v => {
            return {
              name: moment(v[0].date_flash.substring(0, 10)).locale("fr").format('dddd D MMMM YYYY'),
              invaders: _.orderBy(v, "date_flash", 'desc')
            }
          }
        ),
        ({invaders: invaders}) => invaders[0].date_flash,
        'desc'
      )
    }
    else if(mode === "date_pos") {
      return [{
        name: "",
        invaders: _.sortBy(invaders, "date_pos")
      }]
    }
    else {
      return []
    }
  }

  return (
    <div className="App">
      { (invaders.length > 0) &&
        <div className="TotalFrame d-flex flex-row justify-content-end">
          <Menu
            mode={mode}
            onModeChange={setMode}
            totalFlashedCount={invaders.length}
            totalPoints={_.sum(_.map(invaders, "point"))}
            loading={pendingUpdates}
            onClickSave={saveInvaders}
            onClickSync={syncInvaders}
            />

          <div className="MainFrame h-100">
            <div className={`map-container ${mode}`}>
              <InvaderSelector
                onSelect={invader => moveInvader(invader, currentPosition)}
                invaders={_.orderBy(_.filter(invaders, ({position}) => !position), "date_flash", "asc")}
                selectedInvader={undefined}/>
              <Map
                invaders={invaders}
                moveInvader={moveInvader}
                onMove={setCurrentPosition}
                editMode={mode == 'placing'}
                />
            </div>
            { mode !== "by-position" && <div>
              { sortedInvaderGroups().map(
                ({name, invaders}) => <div key={name} className="invader-group">
                  <h2 className="d-flex flex-row justify-content-start">
                    <div className="p-2">{_.sum(_.map(invaders, "point"))}<span className="small"> pts</span></div>
                    <div className="p-2">{invaders.length}<span className="small"> flashés</span></div>
                    
                    <div className="p-2"><span className="small">{name.toUpperCase()}</span></div>
                  </h2>
                  <div className="d-flex flex-row flex-wrap">
                    { invaders.map(invader => 
                      <InvaderComponent onClick={() => {}} key={invader.space_id} invader={invader}/>
                    )}
                  </div>
                </div>
              )}
            </div> }
          </div>
        </div>
      }
    </div>
  );
}

export default App;
