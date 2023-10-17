import React, {useEffect, useState, useRef, useContext } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { useLocation } from 'react-router-dom'
import "./Map.scss"
import _ from "lodash"
import HintsManager from "./HintsManager"
import { HintsContext } from "./HintsProvider"

const PARIS_CENTER = { lat: 48.865597265895, lng: 2.3358128965449443};
const loader = new Loader({
    apiKey: "AIzaSyDha0RPgjh7dHqdtYpZp3NoUPc-DpVwBqo",
    version: "weekly"
});

interface Props {
    invaders: Invader[],
    moveInvader: (invader: Invader, position: Position) => void,
}

const Map:React.FC<Props> = (props) => {
    const {invaders, moveInvader} = props;
    const [googleLoaded, setGoogleLoaded] = useState(false)
    const [currentPosition, setCurrentPosition] = useState(PARIS_CENTER as Position)
    const [timer, setTimer] = useState(0)
    const [markers, setMarkers] = useState([] as google.maps.Marker[])
    const [hintMarkers, setHintMarkers] = useState([] as google.maps.Marker[])
    const map = useRef(undefined as google.maps.Map | undefined)
    const positionMarker = useRef(undefined as google.maps.Marker | undefined)
    const { hints, _fetchHints, deleteHint, _loadingHints, _setLoadingHints} = useContext(HintsContext)


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

    useEffect(() => {
        loader.load().then(() => {
            setGoogleLoaded(true)
        })
    }, [])

    useEffect(() => {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {})
    }, [])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    let pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    positionMarker.current?.setPosition(pos)
                },
                () => {}
            );
        }
    
        const intervalId = setInterval(() => {
          setTimer(timer + 1)
        }, 5000);
    
        // clear interval on re-render to avoid memory leaks
        return () => clearInterval(intervalId);
      }, [timer]);
    

    useEffect(() => {
        if(googleLoaded) {
            map.current = new google.maps.Map(document.getElementById("map") as HTMLElement, {
                center: PARIS_CENTER,
                zoom: 13,
                disableDefaultUI: true,
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
                position: PARIS_CENTER,
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
                      position: PARIS_CENTER,
                      pov: {
                        heading: 34,
                        pitch: 10,
                      },
                    }
                  );

                let positionMarker = new google.maps.Marker({
                    position: PARIS_CENTER,
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
                            fillColor: "#44aa33",
                            fillOpacity: 1.0,
                            strokeWeight: 0,
                            rotation: 0,
                            scale: 8,
                        },
                        map: map.current,
                    });
                    if(editMode) {
                        marker.addListener('click', () => deleteHint(hint))
                    }
                    return marker
                }
            ))
        }
    }, [hints, map.current, googleLoaded, editMode])
    

    return <div
        id="map-container"
        className={ containerClass }>
        <HintsManager currentPosition={currentPosition}/>
        <div id="map"/>
        <div id="pano"/>
    </div>
}

export default Map;