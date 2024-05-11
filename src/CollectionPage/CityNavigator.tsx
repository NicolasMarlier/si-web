import { useNavigate } from "react-router-dom"
import "./CityNavigator.scss"
import CityStats from "./CityStats"

interface Props {
    name: string
    slug: string
    current_slug: string | undefined
    city?: City
}
const CityNavigator = (props: Props) => {
    const { name, slug, current_slug, city } = props
    const navigate = useNavigate()

    const is_current = current_slug === slug
    
    const onClick = () => {
        navigate(is_current ? '/cities' : `/cities/${slug}`)
    }

    if(!current_slug || is_current) {
        return <div
            className={`city ${is_current ? 'current' : ''}`}
            onClick={onClick}>
            <div className='icon chevron-right'/>
            <div className='name'>{name}</div>
            { city && <CityStats city={city}/>}
            { city && <div className='stats'>{city.flashs_count} / { city.invaders_count}</div>}
        </div>
    }
    else {
        return <></>
    }
    
}
export default CityNavigator