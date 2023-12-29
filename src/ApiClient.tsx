import axios from 'axios'
import _ from "lodash"

import Cache from './Cache'

const OFFICIAL_BASE_PATH = "https://space-invaders.com/api"
const UID = "17BE08E8-5414-450A-A258-61AA60A1F51F"//process.env.SPACE_INVADER_UID

const BASE_PATH = "https://space-invader-api.herokuapp.com"
//const BASE_PATH = "http://localhost:3001"



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

const handleError = (error: any) => {
    if(error && error.response && error.response.status === 401) {
        logout()
    }
    else {
        throw(error)
    }
}

const logout = () => {
    window.localStorage.removeItem("uuid")
    window.location.href = "/login"
}



const fetchInvaders = (): Promise<any> => {
    return axios.get(
        `${BASE_PATH}/invaders`,
        axiosConfig()
    )
    .then(({data: invaders}) => invaders as Invader[])
    .catch(handleError)
}


const syncInvaders = async() => {
    const {
        invaders: officialInvaders,
        cities: cities
    } = await fetchInvadersOffical()
    Cache.set('cities', cities)
    return syncApiFromOfficalApi(officialInvaders)
}

const fetchInvadersOffical = (): Promise<{invaders: Invader[], cities: {[name: string]: [count: number]}}> => axios
    .get(`${OFFICIAL_BASE_PATH}/flashesV2/?uid=${UID}`)
    .then(({data: {invaders, cities}}) => ({
        invaders: (Object.values(invaders) as Invader[]),
        cities: (cities as {[name: string]: [count: number]}),
    }))

const listInvaders = (): Promise<Invader[]> => fetchInvaders()

const updateInvader = (invader: Invader) => axios
    .put(
        `${BASE_PATH}/invaders/${invader.name}`,
        invader,
        axiosConfig()
    )
    .catch(handleError)

const syncApiFromOfficalApi = (official_invaders: Invader[]) => axios
    .post(
        `${BASE_PATH}/invaders/sync_from_official_api`,
        official_invaders,
        axiosConfig()
    )
    .catch(handleError)

const insertHint = (hint: Hint): Promise<any> => axios
    .post(
        `${BASE_PATH}/hints/`,
        hint,
        axiosConfig()
    )
    .catch(handleError)

const updateHint = (hint: Hint): Promise<any> => axios
    .put(
        `${BASE_PATH}/hints/${hint.id}`,
        hint,
        axiosConfig()
    )
    .catch(handleError)

const deleteHint = (hint_id: number): Promise<any> => axios
    .delete(
        `${BASE_PATH}/hints/${hint_id}`,
        axiosConfig()
    )
    .catch(handleError)
const listHints = (): Promise<any> => axios
    .get(
        `${BASE_PATH}/hints`,
        axiosConfig()
    )
    .then(({data: hints}) => hints as Hint[])
    .catch(handleError)

const computeCitiesData = (invaders: Invader[], hints: Hint[]): City[] => _.map(
    _.groupBy(
        _.filter(invaders, 'position'),
        invader => invader.city_id
    ),
    (invaders, _city_id) => {
        const invader = invaders[0]
        const slug = invader.name.split("_")[0]
        const cityHints = _.filter(hints, hint => hint.description.startsWith(`${slug}-`))
        return {
            id: invader.city_id,
            name: invader.city_name,
            slug: slug,
            position: invader.position || {lat: 0, lng: 0},
            invaders_count: (Cache.get('cities') || {})[invader.city_name] || 0,
            flashs_count: invaders.length,
            hints_count: _.filter(cityHints, hint => hint.description.indexOf("DEAD") == -1).length,
            deads_count: _.filter(cityHints, hint => hint.description.indexOf("DEAD") > -1).length
        }
    }
)

export default {
    login,
    logout,
    listInvaders,
    updateInvader,
    syncInvaders,
    insertHint,
    updateHint,
    listHints,
    deleteHint,
    computeCitiesData
}
