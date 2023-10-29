const KEY_CURRENT_POSITION = "current_position"

const get = (label: string): any | null => {
    const raw_data = localStorage.getItem(label)
    if(raw_data) {
        return JSON.parse(raw_data)
    }
    return undefined
}

const set = (label: string, data: any) => {
    localStorage.setItem(label, JSON.stringify(data))
}

export default {
    get,
    set,
    KEY_CURRENT_POSITION
}