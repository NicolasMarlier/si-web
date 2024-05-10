import { useNavigate } from "react-router-dom"

interface Props {
    name: string
    slug: string
    current_slug: string | undefined
}
const CityNavigator = (props: Props) => {
    const { name, slug, current_slug } = props
    const navigate = useNavigate()

    if(!current_slug) {
        return <div
            className='city'
            onClick={() => navigate(`/cities/${slug}`)}>
            <div className='icon chevron-right'/>
            {name}
        </div>
    }
    else if(current_slug == slug) {
        return <div
            className='city current'
            onClick={() => navigate(`/cities`)}>
            <div className='icon chevron-right'/>
            {name}
        </div>
    }
    else {
        return <></>
    }
    
}
export default CityNavigator