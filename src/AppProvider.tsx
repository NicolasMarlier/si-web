import { createContext, useEffect, useState } from 'react';
import ApiClient from "./ApiClient"

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
    
    setLoadingMap: (loaded: boolean) => void
    deleteHint: (hint: Hint) => void
    syncInvadersFromOfficialApi: () => void    
    setLoadingHints: (loading: boolean) => void
}
export const AppContext = createContext({
    initialLoading: true
} as Context);

export const AppProvider = ({ children }: any) => {
    const [hints, setHints] = useState([] as Hint[])
    const [initialLoading, setInitialLoading] = useState(true)
    const [loadingHints, setLoadingHints] = useState(true)
    const [loadingInvaders, setLoadingInvaders] = useState(true)
    const [loadingMap, setLoadingMap] = useState(true)
    const [loadingLocation, setLoadingLocation] = useState(true)
    const [loading, setLoading] = useState(true)

    const [currentGeoLocation, setCurrentGeoLocation] = useState({} as GeoPosition)
    const [currentOrientation, setCurrentOrientation] = useState(0)
    
    const [timer, setTimer] = useState(0)
    const [invaders, setInvaders] = useState([] as Invader[])
    
    useEffect(() => {
        fetchHints()
        fetchInvaders()
        setTimer(timer + 1)
    }, [])

    interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      }
      
    useEffect(() => {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
            const requestPermission = (DeviceOrientationEvent as unknown as DeviceOrientationEventiOS).requestPermission;
            const iOS = typeof requestPermission === 'function';
            if (iOS) {
                requestPermission().then((response2) => {
                    window.addEventListener("deviceorientation", function (event) {
                        setCurrentOrientation(Math.round((event as any).webkitCompassHeading || 0))
                    });
                })
            }
        })
    }, [])

    

    const fetchGeoLocation = () => {
        return navigator.geolocation.watchPosition((position) => {
            setLoadingLocation(false)
            setCurrentGeoLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                heading: position.coords.heading,
            })
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
                loadingLocation ||
                loadingHints ||
                loadingInvaders ||
                loadingMap
            )
        }
        
    }, [loadingLocation, loadingHints, loadingInvaders, loadingMap])

    useEffect(() => {
        setLoading(loadingHints || loadingInvaders)
    }, [loadingHints, loadingInvaders])

      
    const fetchHints = () => {
        setLoadingHints(true)
        ApiClient.listHints().then(hints => {
            setLoadingHints(false)
            setHints(hints)
        })
    }

    const fetchInvaders = () => {
        setLoadingInvaders(true)
        ApiClient.listInvaders().then(invaders => {
            setLoadingInvaders(false)
            setInvaders(invaders)
        })
    }

    const deleteHint = (hint: Hint) => {
        setLoadingHints(true)
        if(hint.id) {
            ApiClient.deleteHint(hint.id).then(fetchHints)
        }
    }

    const syncInvadersFromOfficialApi = async() => {
        await ApiClient.syncInvaders()
        return ApiClient.listInvaders().then(setInvaders)
    }

    const moveInvader = async(invader: Invader, position: Position) => {
        setLoadingInvaders(true)
        await ApiClient.updateInvader({
            ...invader,
            ...{position}
        })
        return fetchInvaders
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
        setLoadingHints
    }
 
    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    )
}