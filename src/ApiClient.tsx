import axios from 'axios'
import coords from "./coords"
import reponse from "./response"
import _ from "lodash"
const OFFICIAL_BASE_PATH = "https://space-invaders.com/api"
const UID = "17BE08E8-5414-450A-A258-61AA60A1F51F"//process.env.SPACE_INVADER_UID

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

const syncInvaders = async() => {
    const officialInvaders = await fetchInvadersOffical()
    const myInvaders = await fetchInvaders()
    const existingSpaceIds = _.map(myInvaders, "space_id")
    // return myInvaders.concat(officialInvaders.filter(i => !_.includes(existingSpaceIds, i.space_id)))

    return saveInvaders(officialInvaders.filter(i => !_.includes(existingSpaceIds, i.space_id)))
    // return cached("invaders", fetchInvadersNoConnection).then((invaders) => addCoords(invaders))
}

const fetchInvadersOffical = (): Promise<Invader[]> => {
    return axios.get(`${OFFICIAL_BASE_PATH}/flashesV2/?uid=${UID}`)
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
        .post(`${BASE_PATH}/invaders`, invaders)
}

export default {
    listInvaders,
    saveInvader,
    saveInvaders,
    syncInvaders
}
