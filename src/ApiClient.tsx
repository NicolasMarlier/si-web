import axios from 'axios'
import coords from "./coords"
import reponse from "./response"
import _ from "lodash"
const OFFICIAL_BASE_PATH = "https://space-invaders.com/api"
const UID = "17BE08E8-5414-450A-A258-61AA60A1F51F"//process.env.SPACE_INVADER_UID

const BASE_PATH = "https://space-invader-api.herokuapp.com"


const login = (uuid: string): Promise<any> => {
    window.localStorage.setItem("uuid", uuid)
    return axios.get(
        `${BASE_PATH}/invaders`,
        axiosConfig()
    )
}

const uuid = (): string | null => {
    return window.localStorage.getItem('uuid')
}

const axiosConfig = (): any => ({
        headers: { Authorization: `Bearer ${uuid()}` }
})

const handleError = () => logout

const logout = () => {
    window.localStorage.removeItem("uuid")
    window.location.href = "/login"
}



const fetchInvaders = (): Promise<any> => {
    return axios.get(
        `${BASE_PATH}/invaders`,
        axiosConfig()
    )
    .then(({data: {data: invaders}}) => invaders as Invader[])
    .catch(handleError)
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
    const existingNames = _.map(myInvaders, "name")
    // return myInvaders.concat(officialInvaders.filter(i => !_.includes(existingSpaceIds, i.space_id)))

    return saveInvaders(officialInvaders.filter(i => !_.includes(existingNames, i.name)))
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
            if(invader.name === updatedInvader.name) {
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
        .post(
            `${BASE_PATH}/invaders`,
            invaders,
            axiosConfig()
        )
        .catch(handleError)
}

export default {
    login,
    logout,
    listInvaders,
    saveInvader,
    saveInvaders,
    syncInvaders
}
