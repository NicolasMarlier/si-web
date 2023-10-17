import axios from 'axios'
import _ from "lodash"
const OFFICIAL_BASE_PATH = "https://space-invaders.com/api"
const UID = "17BE08E8-5414-450A-A258-61AA60A1F51F"//process.env.SPACE_INVADER_UID

const BASE_PATH = "https://space-invader-api.herokuapp.com"
// const BASE_PATH = "http://localhost:3001"



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
    .then(({data: {data: invaders}}) => invaders as Invader[])
    .catch(handleError)
}


const syncInvaders = async() => {
    const officialInvaders = await fetchInvadersOffical()
    const myInvaders = await fetchInvaders()
    const existingNames = _.map(myInvaders, "name")

    return saveInvaders(officialInvaders.filter(i => !_.includes(existingNames, i.name)))
}

const fetchInvadersOffical = (): Promise<Invader[]> => {
    return axios.get(`${OFFICIAL_BASE_PATH}/flashesV2/?uid=${UID}`)
        .then(({data: {invaders}}) => Object.values(invaders) as Invader[])
}

const listInvaders = (): Promise<Invader[]> => {
    return fetchInvaders()
}

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

const insertHint = (hint: Hint): Promise<any> => axios
    .post(
        `${BASE_PATH}/hints/`,
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
    .then(({data: {data: hints}}) => hints as Hint[])
    .catch(handleError)


export default {
    login,
    logout,
    listInvaders,
    saveInvader,
    saveInvaders,
    syncInvaders,
    insertHint,
    listHints,
    deleteHint
}
