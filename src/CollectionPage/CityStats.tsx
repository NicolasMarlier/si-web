import './CityStats.scss'


const CityStats = (props: {city: City}) => {
    const { city } = props
    const flashsPct = city.flashs_count * 100 / city.invaders_count
    const hintsPct = city.hints_count * 100 / city.invaders_count
    const deadsPct = city.deads_count * 100 / city.invaders_count
    const style = {
        flashs: {
            width: `${flashsPct}%`
        },
        hints: {
            width: `${hintsPct}%`
        },
        deads: {
            width: `${deadsPct}%`
        }
    }

    return <div className='city-stats'>
        <div className="flashs" style={style['flashs']}/>
        <div className="hints" style={style['hints']}/>
        <div className="deads" style={style['deads']}/>
    </div>
}

export default CityStats

