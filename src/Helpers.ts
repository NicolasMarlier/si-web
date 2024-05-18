const hintInvaderPath = (abstractInvader: AbstractInvader) => {
    return `https://www.instagram.com/explore/tags/${abstractInvader.name.replace('-','_').toLowerCase()}/`
}
const invaderPath = (invader: Invader) => {
    const city_slug = invader.name.split('_')[0]
    return `/cities/${city_slug}/${invader.name}`
}
const cityPath = (invader: Invader) => {
    const city_slug = invader.name.split('_')[0]
    return `/cities/${city_slug}`
}
export default {
    hintInvaderPath,
    invaderPath,
    cityPath,
}