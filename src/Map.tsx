import React, {useEffect, useState, useRef } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import "./Map.scss"
import _ from "lodash"
import ApiClient from './ApiClient'
import { useLocation } from 'react-router-dom'

const PARIS_CENTER = { lat: 48.865597265895, lng: 2.3358128965449443};
const loader = new Loader({
    apiKey: "AIzaSyDha0RPgjh7dHqdtYpZp3NoUPc-DpVwBqo",
    version: "weekly"
});



const Map:React.FC = () => {
    const [invaders, setInvaders] = useState([] as Invader[])
    const [googleLoaded, setGoogleLoaded] = useState(false)
    const [timer, setTimer] = useState(0)
    const [markers, setMarkers] = useState([] as google.maps.Marker[])
    const map = useRef(undefined as google.maps.Map | undefined)
    const positionMarker = useRef(undefined as google.maps.Marker | undefined)

    const location = useLocation();
    const display = location.pathname == "/map"

    useEffect(() => {
        ApiClient.listInvaders().then(setInvaders)
    }, [])

    useEffect(() => {
        loader.load().then(() => {
            console.log("GOOGLE LOADED!")
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
            console.log("COUCOU", document.getElementById("map"))
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
        }
    }, [googleLoaded])
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
                            url: invader.image,
                            scaledSize: new google.maps.Size(30, 30),
                            anchor: new google.maps.Point(10, 10),
                        },
                        map: map.current,
                    });
                    return marker
                }
            ))
        }
    }, [invaders, map.current, googleLoaded])

    return <div
        id="map-container"
        className={`${display ? 'visible' : 'hidden'}`}>
        <div id="map"/>
        <div id="pano"/>
    </div>
}

export default Map;