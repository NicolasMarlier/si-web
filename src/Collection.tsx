import React, { useEffect, useState } from 'react'

import _ from "lodash"
import ApiClient from './ApiClient'
import InvaderComponent from './InvaderComponent';


const Collection:React.FC = () => {
  const [invaders, setInvaders] = useState([] as Invader[])
  const mode = "date_pos"
  
  useEffect(() => {
    ApiClient.listInvaders().then(setInvaders)
  }, [])

  const sortedInvaderGroups = () => {
    // if(mode === "day_flash") {
    //   return _.orderBy(
    //     _.map(
    //       _.groupBy(invaders, ({date_flash}) => date_flash.substring(0, 10)),
    //       v => {
    //         return {
    //           name: moment(v[0].date_flash.substring(0, 10)).locale("fr").format('dddd D MMMM YYYY'),
    //           invaders: _.orderBy(v, "date_flash", 'desc')
    //         }
    //       }
    //     ),
    //     ({invaders: invaders}) => invaders[0].date_flash,
    //     'desc'
    //   )
    // }
    // else
    if(mode === "date_pos") {
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
    <div className="Collection">
      { sortedInvaderGroups().map(
        ({name, invaders}) => <div key={name} className="invader-group">
          <h2 className="d-flex flex-row justify-content-start">
            <div className="p-2">{_.sum(_.map(invaders, "point"))}<span className="small"> pts</span></div>
            <div className="p-2">{invaders.length}<span className="small"> flashés</span></div>
            
            <div className="p-2"><span className="small">{name.toUpperCase()}</span></div>
          </h2>
          <div className="d-flex flex-row flex-wrap">
            { invaders.map(invader => 
              <InvaderComponent onClick={() => {}} key={invader.name} invader={invader}/>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Collection;
