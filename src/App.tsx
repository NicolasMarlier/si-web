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
import { Outlet } from 'react-router-dom'
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

  const totalPoints = _.sum(_.map(invaders, "point")) + _.keys(_.groupBy(invaders, "city_id")).length * 100

  return (
    <div className="App">
      { (invaders.length > 0) &&
        <div className="TotalFrame d-flex flex-row justify-content-end">
          <Menu
            mode={mode}
            onModeChange={setMode}
            totalFlashedCount={invaders.length}
            totalPoints={totalPoints}
            loading={pendingUpdates}
            onClickSave={saveInvaders}
            onClickSync={syncInvaders}
            />

          <div className="MainFrame h-100">
            <Outlet/>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
