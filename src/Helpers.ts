const invaderPath = (invader: Invader) => {
    const city_slug = invader.name.split('_')[0]
    return `/cities/${city_slug}/${invader.name}`
}
const cityPath = (invader: Invader) => {
    const city_slug = invader.name.split('_')[0]
    return `/cities/${city_slug}`
}
export default {
    invaderPath,
    cityPath,
}