import axios from 'axios'
import _ from "lodash"

import Cache from './Cache'

const UID = "17BE08E8-5414-450A-A258-61AA60A1F51F"//process.env.SPACE_INVADER_UID
const BASE_PATH = "https://space-invader-api.herokuapp.com"
const OFFICIAL_API_PATH = "https://api.space-invaders.com/flashinvaders_v3_pas_trop_predictif/api/gallery"

//const BASE_PATH = "http://localhost:3001"



const login = (uuid: string): Promise<any> => {
    window.localStorage.setItem("uuid", uuid)
    return checkLoggedIn()
}

const checkLoggedIn = () => axios
    .get(
        `${BASE_PATH}/invaders`,
        axiosConfig()
    )
    .then(() => {
        return true
    }
    ).catch(error => {
        if(error && error.response && error.response.status === 401) {
            return false
        }
        else {
            throw(error)
        }
    })

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

const rawInvaderV3toV2 = ({
    image_url, point, city_id, name, space_id, date_pos, date_flash
}: RawInvaderV3) => ({
        image: image_url,
        point,
        city_id,
        name,
        space_id,
        date_pos,
        date_flash
    } as Invader)

const fetchInvadersOffical = (): Promise<{invaders: Invader[], cities: CityRaw[]}> => axios
    .get(
        OFFICIAL_API_PATH,
        {
            params: {
                uid: UID
            }
        }
    )
    .then(({data: {invaders, cities}}) => ({
        invaders: (Object.values(invaders) as RawInvaderV3[]).map((invaderV3) => rawInvaderV3toV2(invaderV3)),
        cities: (cities as CityRaw[]),
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

const computeCitiesData = (invaders: Invader[], hints: Hint[]): City[] => {
    const invadersDict = invaders.reduce((result, invader) => {
        result[invader.name] = invader
        return result
    }, {} as {[name: string]: Invader})

    const hintsDict = hints.reduce((result, hint) => {
        const matchData = hint.description.match(/^([A-Z]{2,4}\-[0-9]+)/)
        if(matchData) {
            result[matchData[1].replace('-', "_")] = hint
        }
        
        return result
    }, {} as {[name: string]: Hint})
    

    return _.reduce(
        Cache.get('cities') || {},
        (result, {id, name, si_count}) => {
            const cityInvaders = _.filter(invaders, {city_id: id})
            if(cityInvaders.length == 0) { return result }

            const slug = cityInvaders[0].name.split("_")[0]
            const cityHints = _.filter(hints, hint => hint.description.startsWith(`${slug}-`))
            const position = cityInvaders[0].position || {lat: 0, lng: 0}

            const abstract_invaders = _.range(1, si_count + 1).map(index => {
                const invaderName = [slug, index < 10 ? `0${index}` : index].join("_")
                let object = null
                let kind = 'not_found'
                if(invaderName in invadersDict) {
                    kind = 'invader'
                    object = invadersDict[invaderName]
                }
                else if(index == 1 && slug in invadersDict) {
                    kind = 'invader'
                    object = invadersDict[slug]
                }
                else if(invaderName in hintsDict) {
                    kind = 'hint'
                    object = hintsDict[invaderName]
                }

                return {
                    name: invaderName,
                    city_name: name,
                    object,
                    kind
                }
            })
            return [
                ...result,
                ...[{
                    name,
                    slug,
                    position,
                    invaders_count: si_count,
                    first_flash_at: _.min(_.map(cityInvaders, 'date_flash')),
                    flashs_count: cityInvaders.length,
                    hints_count: _.filter(cityHints, hint => hint.description.indexOf("DEAD") == -1).length,
                    deads_count: _.filter(cityHints, hint => hint.description.indexOf("DEAD") > -1).length,
                    abstract_invaders
                }]
            ]
        },
        [] as City[]
    )
}

export default {
    login,
    logout,
    checkLoggedIn,
    listInvaders,
    updateInvader,
    syncInvaders,
    insertHint,
    updateHint,
    listHints,
    deleteHint,
    computeCitiesData
}
