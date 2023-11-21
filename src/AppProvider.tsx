import { createContext, useEffect, useRef, useState } from 'react';
import _ from 'lodash';

import ApiClient from "./ApiClient"
import Cache from './Cache'

const PARIS_CENTER = {
    lat: 48.864716,
    lng: 2.349014
} as Position

interface Context {
    hints: Hint[]
    invaders: Invader[]
    currentGeoLocation: GeoPosition
    currentOrientation: number

    fetchHints: () => void
    moveInvader: (invader: Invader, position: Position) => void

    initialLoading: boolean
    loading: boolean
    loadingMap: boolean
    currentHint: Hint | null,
    setCurrentHint: (hint: Hint | null) => void
    newHint: (position: Position) => void
    
    setLoadingMap: (loaded: boolean) => void
    deleteHint: (hint: Hint) => void
    syncInvadersFromOfficialApi: () => void    
    setLoadingHints: (loading: boolean) => void
    status: string
    statusGeoLocation: string | undefined
    statusDeviceOrientation: string | undefined
    fetchGeoLocation: () => void
}
export const AppContext = createContext({
    initialLoading: true
} as Context);

export const AppProvider = ({ children }: any) => {
    const [status, setStatus] = useState("")
    const [hints, setHints] = useState([] as Hint[])
    const [initialLoading, setInitialLoading] = useState(true)
    const [loadingHints, setLoadingHints] = useState(true)
    const [loadingInvaders, setLoadingInvaders] = useState(true)
    const [loadingMap, setLoadingMap] = useState(true)

    const [loading, setLoading] = useState(true)
    const [hintWasJustAdded, setHintWasJustAdded] = useState(false)

    const [currentHint, setCurrentHint] = useState(null as Hint | null)

    const [currentGeoLocation, setCurrentGeoLocation] = useState(Cache.get(Cache.KEY_CURRENT_POSITION) || PARIS_CENTER as GeoPosition)
    const [statusGeoLocation, setStatusGeoLocation] = useState(undefined as string | undefined )
    const [statusDeviceOrientation, setStatusDeviceOrientation] = useState(undefined as string | undefined)

    const [currentOrientation, setCurrentOrientation] = useState(0)
    
    const [timer, setTimer] = useState(0)
    const [invaders, setInvaders] = useState([] as Invader[])
    
    useEffect(() => {
        fetchHints()
        fetchInvaders()
        watchDeviceOrientation()
        setTimer(timer + 1)
    }, [])
      
    const watchDeviceOrientation = async() => {
        setStatusDeviceOrientation("unavailable")
        window.addEventListener("deviceorientation", function (event) {
            setStatusDeviceOrientation("active")
            setCurrentOrientation(Math.round((event as any).webkitCompassHeading || 0))
        });
    }


    const newHint = async(position: Position) => {
        setHintWasJustAdded(true)
        await ApiClient.insertHint({
            description: "",
            position: position,
            placed_at: (new Date()).toString()
        })
        await fetchHints()
    }
    useEffect(() => {
        if(hintWasJustAdded) {
            setCurrentHint(_.maxBy(hints, 'id') || null)
            setHintWasJustAdded(false)
        }
    }, [hints])

    useEffect(() => {
        if(currentGeoLocation.lat) {
            Cache.set(Cache.KEY_CURRENT_POSITION, currentGeoLocation)
        }
    }, [currentGeoLocation])
    
    
    const fetchGeoLocation = () => {
        console.log("Fetching geolocation")
        return navigator.geolocation.watchPosition((position) => {
            setStatusGeoLocation("active")
            setCurrentGeoLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                heading: position.coords.heading,
            })
        }, (error) => {
            setStatusGeoLocation(error.message)
            //TODO Handle error properly
        });
    }

    useEffect(() => {
        if(navigator.geolocation) {
            const watchID = fetchGeoLocation()
            return () => navigator.geolocation.clearWatch(watchID);;
        }
    }, [navigator.geolocation]);

    useEffect(() => {
        if(initialLoading) {
            setInitialLoading(
                loadingHints ||
                loadingInvaders
            )
        }
        
    }, [loadingHints, loadingInvaders, loadingMap])

    useEffect(() => {
        setLoading(loadingHints || loadingInvaders)
    }, [loadingHints, loadingInvaders])

      
    const fetchHints = () => {
        setLoadingHints(true)
        return ApiClient.listHints().then(newHints => {
            setLoadingHints(false)
            setHints(newHints)
        })
    }

    const fetchInvaders = () => {
        setLoadingInvaders(true)
        return ApiClient.listInvaders().then(newInvaders => {
            setLoadingInvaders(false)
            setInvaders(newInvaders)
        })
    }

    const deleteHint = (hint: Hint) => {
        setLoadingHints(true)
        if(hint.id) {
            return ApiClient.deleteHint(hint.id).then(fetchHints)
        }
    }

    const syncInvadersFromOfficialApi = async() => {
        setLoadingInvaders(true)
        await ApiClient.syncInvaders()
        return fetchInvaders()
    }

    const moveInvader = async(invader: Invader, position: Position) => {
        setLoadingInvaders(true)
        await ApiClient.updateInvader({
            ...invader,
            ...{position}
        })
        return fetchInvaders()
    }

    const context = {
        initialLoading,
        hints,
        invaders,
        fetchHints,
        currentGeoLocation,
        deleteHint,
        moveInvader,
        setLoadingMap,
        currentOrientation,
        loading,
        loadingMap,
        syncInvadersFromOfficialApi,
        setLoadingHints,
        fetchGeoLocation,
        currentHint,
        setCurrentHint,
        newHint,
        statusGeoLocation,
        statusDeviceOrientation,
        status
    }
 
    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    )
}