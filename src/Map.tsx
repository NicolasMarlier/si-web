import React, {useEffect, useState, useRef, useContext } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { useLocation } from 'react-router-dom'
import "./Map.scss"
import _ from "lodash"
import { AppContext } from "./AppProvider"
import HintModal from "./HintModal"
import ApiClient from "./ApiClient"

const loader = new Loader({
    apiKey: "AIzaSyDha0RPgjh7dHqdtYpZp3NoUPc-DpVwBqo",
    version: "weekly"
});

const Map = () => {
    const [googleLoaded, setGoogleLoaded] = useState(false)

    const [currentHint, setCurrentHint] = useState(null as Hint | null)
    
    
    const [markers, setMarkers] = useState([] as google.maps.Marker[])
    const [hintMarkers, setHintMarkers] = useState([] as google.maps.Marker[])
    const map = useRef(undefined as google.maps.Map | undefined)
    const positionMarker = useRef(undefined as google.maps.Marker | undefined)
    const { hints, invaders, moveInvader, deleteHint, setLoadingMap, currentGeoLocation, currentOrientation, fetchHints } = useContext(AppContext)
    const [currentPosition, setCurrentPosition] = useState(currentGeoLocation as Position)


    const location = useLocation();
    const containerClass = {
        "/map": "full-map",
        "/place": "map-and-pano",
        "/place-hint": "map-pano-and-hints"
    }[location.pathname] || "hidden"
    const editMode = {
        "/place": true,
        "/place-hint": true
    }[location.pathname] || false

    const defaultZoom = {
        "/map": 16,
        "/place": 13,
        "/place-hint": 13
    }[location.pathname] || 13

    const placeHint = async() => {
        await ApiClient.insertHint({
            description: "Bla",
            position: currentPosition,
            placed_at: (new Date()).toString()
        })
        await fetchHints()
        setCurrentHint(_.maxBy(hints, 'id') || null)
        map.current?.setCenter(currentPosition)
    }

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
        setCurrentHint(_.find(hints, {id: currentHint.id}) || null)
    }

    useEffect(() => {
        loader.load().then(() => {
            setGoogleLoaded(true)
        })
    }, [])

    
    

    useEffect(() => {
        if(googleLoaded) {
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
                position: currentGeoLocation,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: "blue",
                    fillOpacity: 0.6,
                    strokeWeight: 0,
                    rotation: 0,
                    scale: 10,
                },
                map: map.current
            });

            map.current.addListener(
                "click",
                (e: any) => {
                    setCurrentHint(null)
                }
            )
            
            setLoadingMap(false)
            
            if(editMode) {

                const positionMarkerIcon = {
                    path: "M -1 1 L -5 1 L -5 -1 L -3 -1 L -3 -3 L -1 -3 L -1 -5 L 1 -5 L 1 -3 L 3 -3 L 3 -1 L 5 -1 L 5 1 L 1 1 L 1 7 L -1 7 L -1 1",
                    fillColor: "#ff0000",
                    fillOpacity: 0.8,
                    strokeWeight: 0,
                    rotation: 0,
                    scale: 2
                };

                const panorama = new google.maps.StreetViewPanorama(
                    document.getElementById("pano") as HTMLElement,
                    {
                      position: currentGeoLocation,
                      pov: {
                        heading: 34,
                        pitch: 10,
                      },
                    }
                  );

                let positionMarker = new google.maps.Marker({
                    position: currentGeoLocation,
                    draggable:editMode,
                    icon: positionMarkerIcon,
                    map: map.current
                });

                positionMarker.addListener(
                    "dragend",
                    (e: any) => {
                        const gPosition = e.latLng
                        panorama.setPosition(gPosition)
                        setCurrentPosition({lat: gPosition.lat(), lng: gPosition.lng()})
                    }
                )

                panorama.addListener("position_changed", () => {
                    const gPosition = panorama.getPosition()
                    positionMarker.setPosition(gPosition)
                    if(gPosition) {
                        setCurrentPosition({lat: gPosition.lat(), lng: gPosition.lng()})
                    }
                })
                panorama.addListener("pov_changed", () => {
                    positionMarker.setIcon({
                        ...positionMarkerIcon,
                        ...{
                            rotation: panorama.getPov().heading
                        }
                    })
                })

                map.current.addListener(
                    "click",
                    (e: any) => {
                        const gPosition = e.latLng
                        positionMarker.setPosition(gPosition)
                        panorama.setPosition(gPosition)
                        setCurrentPosition({lat: gPosition.lat(), lng: gPosition.lng()})
                    }
                )
                map.current.setStreetView(panorama);
            }
        }
    }, [googleLoaded, editMode])

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
    
    useEffect(() => {
        console.log("Map current changed")
    }, [map.current])
    useEffect(() => {
        console.log("Invaders changed")
    }, [invaders])
    useEffect(() => {
        console.log("Google loaded changed")
    }, [googleLoaded])
    
    useEffect(() => {
        if(googleLoaded && map.current) {
            _.each(markers, (marker) => marker.setMap(null))
            setMarkers(_.map(
                _.filter(invaders, "position"),
                invader => {
                    let marker = new google.maps.Marker({
                        position: invader.position,
                        icon: {
                            url: invader.hosted_image_30_url,
                            // scaledSize: new google.maps.Size(30, 30),
                            anchor: new google.maps.Point(10, 10),
                        },
                        draggable:editMode,
                        map: map.current,
                    });
                    marker.addListener("dragend", (e: any) => { moveInvader(invader, {lat: e.latLng.lat(), lng: e.latLng.lng()})})
                    return marker
                }
            ))
        }
    }, [invaders, map.current, googleLoaded, editMode])

    useEffect(() => {
        if(googleLoaded && map.current) {
            _.each(hintMarkers, (marker) => marker.setMap(null))
            setHintMarkers(_.map(
                hints,
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
                        map: map.current,
                    });
                    marker.addListener('click', () => {
                        map.current?.setCenter(hint.position)
                        setCurrentHint(hint)
                    })
                    // if(editMode) {
                        
                    // }
                    return marker
                }
            ))
        }
    }, [hints, map.current, googleLoaded, editMode])
    

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
        { !currentHint && <div className="buttons">
            <div className="btn" onClick={placeHint}>Placer un indice</div>
        </div>}
    </div>
}

export default Map;