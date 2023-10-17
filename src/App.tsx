import React, { useEffect, useState } from 'react'

import _ from "lodash"
import "moment/locale/fr"
import './App.scss';
import './Menu.scss';
import ApiClient from './ApiClient'
import Map from "./Map"
import Menu from "./Menu"
import { Outlet } from 'react-router-dom'
import { HintsProvider } from './HintsProvider';


const App:React.FC = () => {
  const [invaders, setInvaders] = useState([] as Invader[])
  const [pendingUpdates, setPendingUpdates] = useState(false)
  const [hint, setHints] = useState([] as Hint[])

  useEffect(() => {
    ApiClient.listInvaders().then(setInvaders)
  }, [])

  const moveInvader = (invader: Invader, position: Position | undefined) => {
    ApiClient.saveInvader(
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
    ApiClient.saveInvaders(invaders)
  }

  const syncInvaders = async() => {
    await ApiClient.syncInvaders()
    return ApiClient.listInvaders().then(setInvaders)
  }

  const totalPoints = _.sum(_.map(invaders, "point")) + _.keys(_.groupBy(invaders, "city_id")).length * 100

  return (
    <HintsProvider>
      <div className="App">
      { (invaders.length > 0) &&
        <div className="TotalFrame d-flex flex-row justify-content-end">
          <Menu
            totalFlashedCount={invaders.length}
            totalPoints={totalPoints}
            loading={pendingUpdates}
            onClickSave={saveInvaders}
            onClickSync={syncInvaders}
            />

          <div className="MainFrame h-100">
            <Outlet context={[invaders]}/>
            <Map
              invaders={invaders}
              moveInvader={moveInvader}/>
          </div>
        </div>
      }
      </div>
    </HintsProvider>
  );
}

export default App;
