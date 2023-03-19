import React, { useEffect, useState } from 'react'

import _ from "lodash"
import moment from "moment"
import "moment/locale/fr"
import './App.css';
import apiClient from './ApiClient'
import InvaderComponent from './InvaderComponent';
import InvaderSelector from './InvaderSelector'
import Map from "./Map"
import saveButton from './save-button.png';
import invaderLogo from './invader.svg';

const App:React.FC = () => {
  const [invaders, setInvaders] = useState([] as Invader[])
  const [pendingUpdates, setPendingUpdates] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(undefined as Position | undefined)
  const [mode, setMode] = useState("day_flash" as string)
  useEffect(() => {
    apiClient.listInvaders().then(setInvaders)
  }, [])

  const onModeChange=(event: any) => {
    setMode(event.target.value)
  }

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

  const sortedInvaderGroups = () => {
    if(mode == "date_flash") {
      return [{
          name: "TOUS",
          invaders: _.sortBy(invaders, "date_flash")
      }]
    }
    else if(mode == "day_flash") {
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
    else {
      return [{
        name: "",
        invaders: _.sortBy(invaders, "date_pos")
      }]
    }
  }

  return (
    <div className="App">
      { (invaders.length > 0) &&
        <div className="MainFrame d-flex flex-row justify-content-end">
          <div className="menu text-center d-flex flex-column justify-content-center">
            <div className="logo-container">
              <img src={invaderLogo}/>
            </div>
            <div className="summary d-flex flex-row justify-content-center">
              <div className="p-2">{_.sum(_.map(invaders, "point"))}<span className="small"> pts</span></div>
              <div className="p-2">{invaders.length}<span className="small"> flashés</span></div>
            </div>
            <label className={`form-control btn ${mode == "day_flash" ? "selected" : ""}`} >
              <input type="radio" value="day_flash"  name="mode" className="btn" checked={mode == "day_flash"} onChange={onModeChange}/><span className="if-selected">&gt;&gt; </span>DANS L'ORDRE DE FLASH<span className="if-selected"> &lt;&lt;</span>
            </label>
            <label className={`form-control btn ${mode == "date_pos" ? "selected" : ""}`} >
              <input type="radio" value="date_pos"   name="mode" className="btn" checked={mode == "date_pos"} onChange={onModeChange}/><span className="if-selected">&gt;&gt; </span>DANS L'ORDRE DE POSE<span className="if-selected"> &lt;&lt;</span>
            </label>
            <label className={`form-control btn ${mode == "by-position" ? "selected" : ""}`} >
              <input type="radio" value="by-position"   name="mode" className="btn" checked={mode == "by-position"} onChange={onModeChange}/><span className="if-selected">&gt;&gt; </span>CARTE<span className="if-selected"> &lt;&lt;</span>
            </label>

            <div className="buttons">
              { pendingUpdates && <div className="btn save-button" onClick={saveInvaders}><img src={saveButton}/></div>
              }
            </div>
          </div>

          <div className="w-75 h-100">
            <div className={`map-container ${mode}`}>
              <InvaderSelector
                onSelect={invader => moveInvader(invader, currentPosition)}
                invaders={_.orderBy(_.filter(invaders, ({position}) => position === undefined), "date_flash", "asc")}
                selectedInvader={undefined}/>
              <Map
                invaders={invaders}
                moveInvader={moveInvader}
                onMove={setCurrentPosition}
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
