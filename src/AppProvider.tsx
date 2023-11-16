import { createContext, useEffect, useRef, useState } from 'react';
import _ from 'lodash';

import ApiClient from "./ApiClient"
import Cache from './Cache'
import Permissions from './Permissions'

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
    loadingLocation: boolean
    currentHint: Hint | null,
    setCurrentHint: (hint: Hint | null) => void
    newHint: (position: Position) => void
    
    setLoadingMap: (loaded: boolean) => void
    deleteHint: (hint: Hint) => void
    syncInvadersFromOfficialApi: () => void    
    setLoadingHints: (loading: boolean) => void
    status: string
    fetchPermissions: () => void
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
    const [loadingLocation, setLoadingLocation] = useState(true)
    const loadingLocationRef = useRef(true)

    const [loading, setLoading] = useState(true)
    const [hintWasJustAdded, setHintWasJustAdded] = useState(false)

    const [currentHint, setCurrentHint] = useState(null as Hint | null)

    const [currentGeoLocation, setCurrentGeoLocation] = useState({} as GeoPosition)
    const [currentOrientation, setCurrentOrientation] = useState(0)
    
    const [timer, setTimer] = useState(0)
    const [invaders, setInvaders] = useState([] as Invader[])
    
    useEffect(() => {
        fetchHints()
        fetchInvaders()
        fetchPermissions()
        setTimer(timer + 1)
    }, [])
      
    const fetchPermissions = async() => {
        await Permissions.requestPermissionGeoLocation()
        await Permissions.requestPermissionDeviceOrientation()
        window.addEventListener("deviceorientation", function (event) {
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
        const cached_current_position = Cache.get(Cache.KEY_CURRENT_POSITION)
        if(cached_current_position && loadingLocation) {
            setLoadingLocation(false)
            setCurrentGeoLocation(cached_current_position)
        }

        navigator.geolocation.getCurrentPosition(position => {
            setLoadingLocation(false)
            setCurrentGeoLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                heading: position.coords.heading,
            })
        }, (_error) => {
            //TODO Handle error properly
        })

        setTimeout(() => {
            if(loadingLocationRef.current) {
                setLoadingLocation(false)
                setCurrentGeoLocation({
                    lat: PARIS_CENTER.lat,
                    lng: PARIS_CENTER.lng,
                    heading: 0
                })
            }
        }, 5000)

        return navigator.geolocation.watchPosition((position) => {
            setLoadingLocation(false)
            setCurrentGeoLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                heading: position.coords.heading,
            })
        }, (_error) => {
            //TODO Handle error properly
        });
    }

    useEffect(() => {
        loadingLocationRef.current = loadingLocation
    }, [loadingLocation])

    useEffect(() => {
        if(navigator.geolocation) {
            const watchID = fetchGeoLocation()
            return () => navigator.geolocation.clearWatch(watchID);;
        }
    }, [navigator.geolocation]);

    useEffect(() => {
        if(initialLoading) {
            setInitialLoading(
                loadingLocation ||
                loadingHints ||
                loadingInvaders
            )
        }
        
    }, [loadingLocation, loadingHints, loadingInvaders, loadingMap])

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
        loadingLocation,
        syncInvadersFromOfficialApi,
        setLoadingHints,
        status,
        fetchPermissions,
        fetchGeoLocation,
        currentHint,
        setCurrentHint,
        newHint
    }
 
    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    )
}