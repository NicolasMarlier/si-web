import React, { useContext, useEffect, useState } from 'react'

import _ from "lodash"
import "moment/locale/fr"
import './App.scss';
import './Icons.scss';
import Map from "./MapsPage/Map"
import { Outlet } from 'react-router-dom'
import { AppContext } from './AppProvider';
import InitialLoading from './InitialLoading';
import SearchOverlay from './SearchOverlay';



const App:React.FC = () => {
  const { initialLoading } = useContext(AppContext)


  return (
    
      <div className="App">
        { initialLoading && <InitialLoading/> }
        { 
         !initialLoading && <div className="TotalFrame d-flex flex-row justify-content-end">
          <div className="MainFrame h-100">
            <Outlet/>
            <Map/>
            <SearchOverlay/>
          </div>
        </div>
      }
      </div>
  );
}

export default App;
