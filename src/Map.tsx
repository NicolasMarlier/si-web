import React, {useEffect, useState, useRef, useContext, useCallback } from "react"
import { useLocation } from 'react-router-dom'
import "./Map.scss"
import _ from "lodash"
import { AppContext } from "./AppProvider"
import HintModal from "./HintModal"
import ApiClient from "./ApiClient"
import InvaderModal from "./InvaderModal"
import Menu from "./Menu"


const positionMarkerIcon ={
    path: "M -1 1 L -5 1 L -5 -1 L -3 -1 L -3 -3 L -1 -3 L -1 -5 L 1 -5 L 1 -3 L 3 -3 L 3 -1 L 5 -1 L 5 1 L 1 1 L 1 7 L -1 7 L -1 1",
    fillColor: "#ff0000",
    fillOpacity: 0.8,
    strokeWeight: 0,
    rotation: 0,
    scale: 2
};

const hintIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "#22ff3366",
    fillOpacity: 1.0,
    strokeWeight: 0,
    rotation: 0,
    scale: 20,
}

const selectedHintIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "#22ff3366",
    fillOpacity: 1.0,
    strokeColor: "#22ff33",
    strokeWeight: 2,
    rotation: 0,
    scale: 20,
}

const Map = () => {
    const invaderMarkers = useRef({} as {[key: string]: google.maps.Marker})
    const hintMarkers = useRef({} as {[key: string]: google.maps.Marker})
    const map = useRef(undefined as google.maps.Map | undefined)
    const positionMarker = useRef(undefined as google.maps.Marker | undefined)
    const panorama = useRef(undefined as google.maps.StreetViewPanorama | undefined)

    const { hints, invaders, moveInvader, deleteHint, setCurrentHint, currentHint, setLoadingMap, currentGeoLocation, currentOrientation, fetchHints, newHint } = useContext(AppContext)
    const [currentPosition, setCurrentPosition] = useState(currentGeoLocation as Position)

    const selectedHintReference = useRef(null as Hint | null)

    const selectedInvaderReference = useRef(null as Invader | null)
    const [selectedInvader, setSelectedInvader] = useState(null as Invader | null)
    const [selectedInvaderPosition, setSelectedInvaderPosition] = useState(undefined as Position | undefined)

    const [editMode, setEditMode] = useState(false)
    const [containerClass, setContainerClass] = useState("")
    const location = useLocation();
    
    const clickOnMap = (e: any) => {
        setCurrentHint(null)
        setSelectedInvader(null)
        console.log("HEHO !", editMode)
        if(editMode) {
            const gPosition = e.latLng
            positionMarker.current?.setPosition(gPosition)
            panorama.current?.setPosition(gPosition)
            setCurrentPosition({lat: gPosition.lat(), lng: gPosition.lng()})
        }
    }

    useEffect(() => {
        setContainerClass({
            "/map": "full-map",
            "/place": "map-and-pano"
        }[location.pathname] || "hidden")
        setEditMode({
            "/place": true
        }[location.pathname] || false)
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
        
        map.current = new google.maps.Map(document.getElementById("map") as HTMLElement, {
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
        
        positionMarker.current = new google.maps.Marker({
            position: currentPosition,
            icon: positionMarkerIcon,
            map: map.current
        });

        initPanorama()
        positionMarker.current?.setDraggable(editMode);
        positionMarker.current?.addListener(
            "dragend",
            (e: any) => {
                const gPosition = e.latLng
                panorama.current?.setPosition(gPosition)
                setCurrentPosition({lat: gPosition.lat(), lng: gPosition.lng()})
            }
        )

        setLoadingMap(false)
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
                ...positionMarkerIcon,
                ...{
                    rotation: panorama.current?.getPov().heading
                }
            })
        })
        map.current?.setStreetView(panorama.current);
    }

    useEffect(() => {
        if(positionMarker.current) {
            positionMarker.current.setPosition(currentGeoLocation)
        }
        
    }, [currentGeoLocation])

    useEffect(() => {
        if(positionMarker.current) {
            positionMarker.current.setIcon({
                path: "M -1 1 L -5 1 L -5 -1 L -3 -1 L -3 -3 L -1 -3 L -1 -5 L 1 -5 L 1 -3 L 3 -3 L 3 -1 L 5 -1 L 5 1 L 1 1 L 1 7 L -1 7 L -1 1",
                fillColor: "#ff0000",
                fillOpacity: 0.8,
                strokeWeight: 0,
                rotation: currentOrientation,
                scale: 2
            })
        }
        
    }, [currentOrientation])

    const invaderIcon = (invader: Invader, params={} as any) => {
        const size = params.selected ? 40 : 30
        return {
            url: invader.hosted_image_300_url,
            scaledSize: new google.maps.Size(size, size),
            anchor: new google.maps.Point(10, 10),
        }
    }
    
    
    useEffect(() => {
        if(map.current) {
            console.log("Set all markers. ")
            _.each(invaderMarkers.current, marker => marker.setMap(null))
            invaderMarkers.current = _.mapValues(
                _.keyBy(_.filter(invaders, "position"), 'name'),
                invader => {
                    let marker = new google.maps.Marker({
                        position: invader.position,
                        icon: invaderIcon(invader, {selected: selectedInvaderReference.current?.name === invader.name}),
                        draggable: false,
                        map: map.current,
                    });
                    marker.addListener("dragend", (e: any) => {
                        setSelectedInvaderPosition({lat: e.latLng.lat(), lng: e.latLng.lng()})
                    })
                    marker.addListener("click", () => setSelectedInvader(invader))
                    return marker
                }
            )
        }
    }, [invaders, map.current])


    const unselectSelectedInvaderMarker = () => {
        if(selectedInvaderReference.current?.name && selectedInvaderReference.current?.position) {
            const marker = invaderMarkers.current[selectedInvaderReference.current?.name]
            marker.setIcon(invaderIcon(selectedInvaderReference.current))
            marker.setDraggable(false)
            marker.setPosition(selectedInvaderReference.current?.position)
        }
    }

    const selectSelectedInvaderMarker = () => {
        if(selectedInvaderReference.current?.name && selectedInvaderReference.current?.position) {
            const marker = invaderMarkers.current[selectedInvaderReference.current?.name]
            marker.setIcon(invaderIcon(selectedInvaderReference.current, {selected: true}))
            marker.setDraggable(editMode)
            map.current?.panTo(selectedInvaderReference.current.position)
        }
    }

    const unselectSelectedHintMarker = () => {
        if(selectedHintReference.current?.id) {
            const marker = hintMarkers.current[selectedHintReference.current?.id]
            marker.setIcon(hintIcon)
            marker.setDraggable(false)
        }
    }

    const selectSelectedHintMarker = () => {
        if(selectedHintReference.current?.id) {
            const marker = hintMarkers.current[selectedHintReference.current?.id]
            marker.setIcon(selectedHintIcon)
            marker.setDraggable(editMode)
            map.current?.panTo(selectedHintReference.current.position)
        }
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
        positionMarker.current?.setDraggable(editMode);
        if(map.current) {
            google.maps.event.clearListeners(map.current, 'click');
            map.current?.addListener("click", clickOnMap)
        }
    }, [editMode])

    useEffect(() => {
        if(map.current) {
            _.each(hintMarkers.current, (marker, _id) => marker.setMap(null))
            hintMarkers.current = _.mapValues(
                _.keyBy(hints, 'id'),
                hint => {
                    let marker = new google.maps.Marker({
                        position: hint.position,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: "#22ff3366",
                            fillOpacity: 1.0,
                            strokeWeight: 0,
                            rotation: 0,
                            scale: 20,
                        },
                        zIndex: 10,
                        map: map.current,
                    });
                    marker.addListener('click', () => {
                        setCurrentHint(hint)
                    })
                    // if(editMode) {
                        
                    // }
                    return marker
                }
            )
        }
    }, [hints])


    useEffect(() => {
        console.log("map.current changed")
    }, [map.current])

    useEffect(() => {
        console.log("invaders changed")
    }, [invaders])

    useEffect(() => {
        console.log(`editMode changed: ${editMode}`)
    }, [editMode])
    

    return <div
        id="map-container"
        className={ containerClass }>
        <div id="map"/>
        <div id="pano"/>
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
                    setSelectedInvader(null)
                }
            }}
            />
        }
        <Menu>
            <div className="btn" onClick={() => newHint(currentPosition)}>
                <div className="icon new-hint"/>
            </div>
        </Menu>
    </div>
}

export default Map;