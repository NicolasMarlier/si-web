import React, {useEffect, useState, useRef, useContext, useCallback } from "react"
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import "./Map.scss"
import _ from "lodash"
import { AppContext } from "../AppProvider"
import HintModal from "./HintModal"
import ApiClient from "../ApiClient"
import InvaderModal from "./InvaderModal"
import Menu from "../Menu"
import InvaderSelector from "./InvaderSelector"
import { cityIcon } from "./Icons"
import hintPng from '../icons/hint.png'
import hintDeadPng from '../icons/hint-dead.png'
import hintInflashablePng from '../icons/hint-inflashable.png'


const arrowPath = "M -1 1 L -5 1 L -5 -1 L -3 -1 L -3 -3 L -1 -3 L -1 -5 L 1 -5 L 1 -3 L 3 -3 L 3 -1 L 5 -1 L 5 1 L 1 1 L 1 7 L -1 7 L -1 1"

const POSITION_MARKER_COLOR = "#00acff"
const POSITION_MARKER_GEO_COLOR = "#2bcc23"



const hintColor = (hint: Hint) => {
    if(hint.description.includes("DEAD")) {
        return "#000000"
    }
    else if(hint.description.includes("INFLASHABLE")) {
        return "#ff8905"
    }
    return "#2bcc23"
}

const hintUrl = (hint: Hint) => {
    if(hint.description.includes("DEAD")) {
        return hintDeadPng
    }
    else if(hint.description.includes("INFLASHABLE")) {
        return hintInflashablePng
    }
    return hintPng
}

const hintIcon2 = (hint: Hint) => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: hintColor(hint),
    fillOpacity: 0.25,
    strokeWeight: 0,
    rotation: 0,
    scale: 20,
})

const hintIcon = (hint: Hint) => ({url: hintUrl(hint)})

const selectedHintIcon = (hint: Hint) => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: hintColor(hint),
    fillOpacity: 0.5,
    strokeColor: hintColor(hint),
    strokeWeight: 2,
    rotation: 0,
    scale: 20,
})

const Map = () => {
    const invaderMarkers = useRef({} as {[key: string]: google.maps.Marker})
    const hintMarkers = useRef({} as {[key: string]: google.maps.Marker})
    const cityMarkers = useRef({} as {[key: string]: google.maps.Marker})

    const map = useRef(undefined as google.maps.Map | undefined)
    const placesService = useRef(undefined as any | undefined)
    const positionMarker = useRef(undefined as google.maps.Marker | undefined)
    const panorama = useRef(undefined as google.maps.StreetViewPanorama | undefined)

    const { hints, invaders, cities, moveInvader, deleteHint, setCurrentHint, currentHint, setLoadingMap, currentGeoLocation, currentOrientation, fetchHints, newHint } = useContext(AppContext)
    const [currentPosition, setCurrentPosition] = useState(currentGeoLocation as Position)

    const selectedHintReference = useRef(null as Hint | null)

    const selectedInvaderReference = useRef(null as Invader | null)
    const [selectedInvader, setSelectedInvader] = useState(null as Invader | null)
    const [selectedInvaderPosition, setSelectedInvaderPosition] = useState(undefined as Position | undefined)

    const editModeReference = useRef(false)
    const [containerClass, setContainerClass] = useState("")
    const location = useLocation();
    const navigate = useNavigate();

    const { invader_name } = useParams()

    useEffect(() => {
        if(invader_name?.startsWith("HINT-")) {
            const id = parseInt(invader_name.replace("HINT-", ""))
            setCurrentHint(_.find(hints, {id}) || null)
        }
        else {
            setSelectedInvader(_.find(invaders, {name: invader_name}) || null)
        }
    }, [invader_name])

    const initiateNewHint = () => newHint(editModeReference.current ? currentPosition : currentGeoLocation)
    const keyDownListener = useCallback((e: KeyboardEvent) => {
        if(e.target && (e.target as any).tagName !== "INPUT") {
            if(e.code === 'Space') {
                initiateNewHint()
                e.stopPropagation()
            }
            if(e.code === 'Backspace') {
                e.stopPropagation()
                e.preventDefault()
                deleteCurrentHint()
            }
        }
    }, [currentHint, currentPosition, currentGeoLocation])
    useEffect(
        () => {
          window.addEventListener('keydown', keyDownListener);
    
          return () => {
            window.removeEventListener('keydown', keyDownListener);
          };
        },
        [currentHint, currentPosition, currentGeoLocation]
    );
    

    const positionMarkerIcon = (orientation: number) => ({
        path: arrowPath,
        fillColor: editModeReference.current ? POSITION_MARKER_COLOR : POSITION_MARKER_GEO_COLOR,
        fillOpacity: 0.8,
        strokeWeight: 0,
        rotation: orientation,
        scale: 2
    })

    const showCityMarkers = () => {
        const currentZoom = map.current?.getZoom()
        return currentZoom && currentZoom <= 12
    }
    const zoomChanged = () => {
        if(showCityMarkers()) {
            _.forEach(invaderMarkers.current, marker => marker.setMap(null))
            _.forEach(hintMarkers.current, marker => marker.setMap(null))
            _.forEach(cityMarkers.current, marker => marker.setMap(map.current || null))
        }
        else {
            _.forEach(invaderMarkers.current, marker => marker.setMap(map.current || null))
            _.forEach(hintMarkers.current, marker => marker.setMap(map.current || null))
            _.forEach(cityMarkers.current, marker => marker.setMap(null))
        }
    }
    
    const clickOnMap = (e: any) => {
        setCurrentHint(null)
        navigate(`/${editModeReference.current ? 'place' : 'map'}/`)
    
        if(editModeReference.current) {    
            const gPosition = e.latLng
            positionMarker.current?.setPosition(gPosition)
            panorama.current?.setPosition(gPosition)
            setCurrentPosition({lat: gPosition.lat(), lng: gPosition.lng()})
        }
    }

    useEffect(() => {
        setContainerClass({
            "map": "full-map",
            "place": "map-and-pano"
        }[location.pathname.split("/")[1]] || "hidden")
        editModeReference.current = ({
            "place": true
        }[location.pathname.split("/")[1]] || false)
    }, [location]);

    const defaultZoom = 16


    const deleteCurrentHint = () => {
        if(currentHint) {
            deleteHint(currentHint)
            setCurrentHint(null)
        }
    }

    const onUpdateDescription = async(description: string) => {
        if(!currentHint) {
            return
        }
        await ApiClient.updateHint({
                ...currentHint,
                ...{
                    description: description
                }
        })
        await fetchHints()
        setCurrentHint(null)
    }

    useEffect(() => {

        const initAll = async() => {
            //@ts-ignore
            const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
            //@ts-ignore
            const { PlacesService } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

            map.current = new Map(document.getElementById("map") as HTMLElement, {
                center: currentGeoLocation,
                zoom: defaultZoom,
                disableDefaultUI: true,
                clickableIcons: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: [
                    {
                        featureType: "all",
                        elementType: "all",
                        stylers: [
                            {
                                "saturation": -100
                            }
                        ]
                    },
                    {
                        featureType: "poi",
                        elementType: "all",
                        stylers: [
                            {
                                "visibility": "off"
                            }
                        ]
                    }
                ]
            })

            map.current?.addListener("click", clickOnMap)
            map.current?.addListener('zoom_changed', zoomChanged);
    
            placesService.current = new PlacesService(map.current);
            
            positionMarker.current = new google.maps.Marker({
                position: currentPosition,
                icon: positionMarkerIcon(currentOrientation),
                map: map.current
            });
    
            initPanorama()
            positionMarker.current?.setDraggable(editModeReference.current);
            positionMarker.current?.addListener(
                "dragend",
                (e: any) => {
                    const gPosition = e.latLng
                    panorama.current?.setPosition(gPosition)
                    setCurrentPosition({lat: gPosition.lat(), lng: gPosition.lng()})
                }
            )
    
            setLoadingMap(false)
        }
        initAll()
    }, [])

    const initPanorama = () => {
        panorama.current = new google.maps.StreetViewPanorama(
            document.getElementById("pano") as HTMLElement,
            {
                position: currentGeoLocation,
                pov: {
                heading: 34,
                pitch: 10,
                },
            }
        );
        panorama.current.addListener("position_changed", () => {
            const gPosition = panorama.current?.getPosition()
            if(gPosition) {
                positionMarker.current?.setPosition(gPosition)
                setCurrentPosition({lat: gPosition.lat(), lng: gPosition.lng()})
            }
        })
        panorama.current.addListener("pov_changed", () => {
            positionMarker.current?.setIcon({
                ...positionMarkerIcon(panorama.current?.getPov().heading || currentOrientation)
            })
        })
        map.current?.setStreetView(panorama.current);
    }

    useEffect(() => {
        if(positionMarker.current && !editModeReference.current) {
            positionMarker.current.setPosition(currentGeoLocation)
        }
        
    }, [currentGeoLocation, editModeReference.current])

    const invaderIcon = (invader: Invader, params={} as any) => {
        const size = params.selected ? 60 : 30
        return {
            url: invader.hosted_image_300_url,
            scaledSize: new google.maps.Size(size, size),
            anchor: new google.maps.Point(size / 2, size / 2),
        }
    }
    
    
    useEffect(() => {
        if(map.current) {
            invaderMarkers.current ||= {}
            _.filter(invaders, "position").forEach(invader => {
                if(invaderMarkers.current[invader.name]) {
                    invaderMarkers.current[invader.name].setPosition(invader.position)
                }
                else {
                    let marker = new google.maps.Marker({
                        position: invader.position,
                        icon: invaderIcon(invader, {selected: selectedInvaderReference.current?.name === invader.name}),
                        draggable: false,
                        map: showCityMarkers() ? null : map.current,
                        zIndex: selectedInvaderReference.current?.name === invader.name ? 10 : 1
                    });
                    marker.addListener("dragend", (e: any) => {
                        setSelectedInvaderPosition({lat: e.latLng.lat(), lng: e.latLng.lng()})
                    });
                    
                    marker.addListener("click", () => {
                        setCurrentHint(null)
                        navigate(`/${editModeReference.current ? 'place' : 'map'}/${invader.name}`)
                    })
                    invaderMarkers.current[invader.name] = marker
                }
            })
            selectSelectedInvaderMarker()
        }
    }, [invaders, map.current])


    useEffect(() => {
        if(map.current) {
            cityMarkers.current ||= {}
            cities.forEach(city => {
                if(cityMarkers.current[city.name]) {
                    cityMarkers.current[city.name].setIcon(cityIcon(city))
                }
                else {
                    let marker = new google.maps.Marker({
                        position: city.position,
                        icon: cityIcon(city),
                        draggable: false,
                        map: showCityMarkers() ? map.current : null,
                    });
                    marker.addListener('click', () => {
                        map.current?.panTo(city.position)
                        map.current?.setZoom(13)
                    })
                    cityMarkers.current[city.name] = marker
                }
            })
        }
    }, [cities, map.current])


    const unselectSelectedInvaderMarker = () => {
        if(selectedInvaderReference.current?.name && selectedInvaderReference.current?.position) {
            const marker = invaderMarkers.current[selectedInvaderReference.current?.name]
            marker?.setIcon(invaderIcon(selectedInvaderReference.current))
            marker?.setDraggable(false)
            marker?.setPosition(selectedInvaderReference.current?.position)
            marker?.setZIndex(1)
        }
    }

    const selectSelectedInvaderMarker = () => {
        if(selectedInvaderReference.current?.name && selectedInvaderReference.current?.position) {
            const marker = invaderMarkers.current[selectedInvaderReference.current?.name]
            marker?.setIcon(invaderIcon(selectedInvaderReference.current, {selected: true}))
            marker?.setDraggable(editModeReference.current)
            marker?.setZIndex(10)
            map.current?.panTo(selectedInvaderReference.current.position)
            if(editModeReference.current) {
                panorama.current?.setPosition(selectedInvaderReference.current.position)
            }
        }
    }

    const unselectSelectedHintMarker = () => {
        if(selectedHintReference.current?.id) {
            const marker = hintMarkers.current[selectedHintReference.current?.id]
            marker?.setIcon(hintIcon(selectedHintReference.current))
            marker?.setDraggable(false)
        }
    }

    const selectSelectedHintMarker = () => {
        if(selectedHintReference.current?.id) {
            const marker = hintMarkers.current[selectedHintReference.current?.id]
            marker?.setIcon(selectedHintIcon(selectedHintReference.current))
            marker?.setDraggable(editModeReference.current)
            map.current?.panTo(selectedHintReference.current.position)
            if(editModeReference.current) {
                panorama.current?.setPosition(selectedHintReference.current.position)
            }
            
        }
    }

    const panToCurrentLocation = () => {
        map.current?.panTo(currentGeoLocation)
    }


    useEffect(() => {
        unselectSelectedInvaderMarker()
        selectedInvaderReference.current = selectedInvader
        selectSelectedInvaderMarker()
        setSelectedInvaderPosition(selectedInvader?.position)
    }, [selectedInvader])

    
    useEffect(() => {
        unselectSelectedHintMarker()
        selectedHintReference.current = currentHint
        selectSelectedHintMarker()
    }, [currentHint])

    useEffect(() => {
        positionMarker.current?.setDraggable(editModeReference.current);
        positionMarker.current?.setIcon(positionMarkerIcon(currentOrientation))
    }, [currentOrientation, editModeReference.current])


    useEffect(() => {
        if(map.current) {
            _.each(hintMarkers.current, (marker, _id) => marker.setMap(null))
            hintMarkers.current = _.mapValues(
                _.keyBy(hints, 'id'),
                hint => {
                    let marker = new google.maps.Marker({
                        position: hint.position,
                        icon: hintIcon(hint),
                        zIndex: 10,
                        map: showCityMarkers() ? null : map.current,
                    });
                    marker.addListener('click', () => {
                        navigate(`/${editModeReference.current ? 'place' : 'map'}`)
                        setCurrentHint(hint)
                    })
                    return marker
                }
            )
            selectSelectedHintMarker()
        }
    }, [hints, map.current])
    
    const invadersToPosition = invaders.filter(i => !i.position)

    const searchPlace = (e: React.SyntheticEvent) => {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            query: { value: string };
        };
        const query = target.query.value;

        const request = {
            query,
            fields: ['name', 'geometry']
        }

        placesService.current?.findPlaceFromQuery(request, function(results: any, status: any) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                const gPosition = results[0].geometry.location
                positionMarker.current?.setPosition(gPosition)
                panorama.current?.setPosition(gPosition)
                map.current?.setCenter(gPosition)
                setCurrentPosition({lat: gPosition.lat(), lng: gPosition.lng()})
            }
        });
    }

    return <div
        id="map-container"
        className={ containerClass }>
        <div id="map"/>
        <div id="pano"/>
        <div id="search">
            <form onSubmit={searchPlace}>
                <input name="query"/>
            </form>
        </div>
        <div className="center-here" onClick={panToCurrentLocation}>
            <div className="icon location"/>
        </div>
        { invadersToPosition && <InvaderSelector
            invaders={invadersToPosition}
            hints={hints}
            onSelect={(i) => moveInvader(i, currentPosition)}
            onSelectHint={(hint) => setCurrentHint(hint)}/>}
        { currentHint && <HintModal
            hint={currentHint}
            onDelete={deleteCurrentHint}
            onUpdateDescription={onUpdateDescription}
            />
        }
        { selectedInvader && selectedInvaderPosition && <InvaderModal
            invader={selectedInvader}
            invaderPosition={selectedInvaderPosition}
            onSave={() => {
                if(selectedInvaderPosition) {
                    if(selectedInvaderReference.current) {
                        selectedInvaderReference.current.position = selectedInvaderPosition
                    }
                    moveInvader(selectedInvader, selectedInvaderPosition)
                }
            }}
            />
        }
        <Menu>
            <div className="btn" onClick={initiateNewHint}>
                <div className="icon new-hint"/>
                <div className="desktop-label">Nouvel indice</div>
            </div>
        </Menu>
    </div>
}

export default Map;