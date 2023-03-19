import axios from 'axios'
import coords from "./coords"
import reponse from "./response"
import _ from "lodash"
const OFFICIAL_BASE_PATH = "https://space-invaders.com/api"
const UID = process.env.SPACE_INVADER_UID

const BASE_PATH = "https://space-invader-api.herokuapp.com"


const fetchInvaders = (): Promise<any> => {
    return axios.get(`${BASE_PATH}/invaders`)
        .then(({data: {data: invaders}}) => invaders as Invader[])
}

// const addCoords = (invaders: Invader[]) => {
//     return _.map(invaders, invader => {
//         const coord = (coords as any)[invader.name]
//         let position = undefined
//         let lng = undefined
//         if(coord !== undefined) {
//             position = {
//                 lat: parseFloat(coord.split(",")[0]),
//                 lng: parseFloat(coord.split(",")[1])
//             }
//         }
//         return {
//             ...invader,
//             ...{position: invader.position || position}
//         }
//     })
// }

const fetchInvadersOffical = (): Promise<Invader[]> => {
    return axios.get(`${BASE_PATH}/flashesV2/?uid=${UID}`)
        .then(({data: {invaders}}) => Object.values(invaders) as Invader[])
}

const listInvaders = (): Promise<Invader[]> => {
    return fetchInvaders()
    // return cached("invaders", fetchInvadersNoConnection).then((invaders) => addCoords(invaders))
}

// const cached = <T,>(key: string, fetcher: () => Promise<T>): Promise<T> => {
//     const cached = window.localStorage.getItem(key)
//     if(cached !== null) {
//         return new Promise((resolve, _reject) => { resolve(JSON.parse(cached)) })
//     }
//     return fetcher().then((data) => {
//         window.localStorage.setItem(key, JSON.stringify(data))
//         return data
//     })

// }

const saveInvader=(invaders: Invader[], updatedInvader: Invader): Promise<Invader[]> => {
    return new Promise(resolve => resolve(
        invaders.map(invader => {
            if(invader.space_id === updatedInvader.space_id) {
                return updatedInvader
            }
            else {
                return invader
            }
        })
        )
    )
}

const saveInvaders = (invaders: Invader[]) => {
    axios
        .post(`http://localhost:3001/save`, invaders)
}

export default {
    listInvaders,
    saveInvader,
    saveInvaders
}
