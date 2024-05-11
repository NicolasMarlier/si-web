import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import _ from "lodash"
import InvaderComponent from './InvaderComponent';
import "./Collection.scss"
import { AppContext } from '../AppProvider';
import InvaderZoomedComponent from './InvaderZoomedComponent';
import Menu from "../Menu"
import AbstractInvaderComponent from './AbstractInvaderComponent';
import Helpers from '../Helpers';
import CityNavigator from './CityNavigator';

const Collection = () => {
  const { invaders, cities } = useContext(AppContext)
  const [currentInvader, setCurrentInvader] = useState(null as Invader | null)
  const [currentCity, setCurrentCity] = useState(undefined as City | undefined)
  const [abstractInvadersToDisplay, setAbstractInvadersToDisplay] = useState([] as AbstractInvader[])
  const [abstractInvaders, setAbstractInvaders] = useState([] as AbstractInvader[])
  const [reverseOrder, setReverseOrder] = useState(true)

  const navigate = useNavigate()
  const { invader_name } = useParams()
  const { city_slug } = useParams()

  useEffect(() => {
    setCurrentInvader(_.find(invaders, {name: invader_name}) || null)
  }, [invader_name])

  useEffect(() => {
    if(!city_slug) {
      setCurrentCity(undefined)
    }
    if(city_slug === 'all') {
      setCurrentCity(undefined)
    }
    else {
      setCurrentCity(_.find(cities, {slug: city_slug}))
    }
  }, [city_slug])

  useEffect(() => {
    if(city_slug === 'all') {
      setAbstractInvaders(
        _.map(
          _.sortBy(invaders, 'date_flash'),
          (invader) => ({
            name: invader.name,
            city_name: invader.city_name,
            kind: 'invader',
            object: invader
          })
        )
      )
    }
    else if(currentCity) {
      setAbstractInvaders(
        _.sortBy(currentCity.abstract_invaders, (ai) => parseInt(ai.name.split(/-|_/)[1]))
      )
    }
    else {
      setAbstractInvaders([])
    }
  }, [city_slug, currentCity, reverseOrder])

  useEffect(() => {
    if(reverseOrder) {
      setAbstractInvadersToDisplay(_.reverse(abstractInvaders))
    }
    else {
      setAbstractInvadersToDisplay(abstractInvaders)
    }
  }, [abstractInvaders, reverseOrder])

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
          onClick={() => navigate(Helpers.invaderPath(invader))}
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
      <div className="cities">
        <CityNavigator
          name='Tous'
          slug='all'
          current_slug={city_slug}/>
        { _.sortBy(cities, (c => c.first_flash_at || '')).map((city) => 
          <CityNavigator
            name={city.name}
            slug={city.slug}
            current_slug={city_slug}/>
        ) }
      </div>

      <div className="collection">
        { abstractInvadersToDisplay.map(abstract_invader => component(abstract_invader)) }
      </div>
      { currentInvader && <InvaderZoomedComponent invader={currentInvader} onClose={() => navigate(Helpers.cityPath(currentInvader))}/>}
      <Menu>
      { !currentInvader && <>
          { (city_slug === 'all' || currentCity) && reverseOrder &&
            <div className={`btn round`} onClick={ () => setReverseOrder(!reverseOrder) }>
              <div className="icon arrow-up"></div>
              <div className="desktop-label">Anciens d'abord</div>
            </div>
          }
          { (city_slug === 'all' || currentCity) && !reverseOrder &&
            <div className={`btn round`} onClick={ () => setReverseOrder(!reverseOrder) }>
              <div className="icon arrow-down"></div>
              <div className="desktop-label">Récents d'abord</div>
            </div>
          }
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
