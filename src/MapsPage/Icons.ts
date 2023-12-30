import _ from "lodash"

const pieChartPath = (radius: number, thickness: number, startAngle: number, endAngle: number) => {
    const smallRadius = radius - thickness
    const startAngleinRadiant = startAngle * Math.PI / 180.0
    const endAngleinRadiant = endAngle * Math.PI / 180.0
    const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0
    return `
    M 0 0
    M ${radius * Math.cos(startAngleinRadiant)} ${radius * Math.sin(startAngleinRadiant)}
    A ${radius} ${radius}  0 ${largeArcFlag} 1  ${radius * Math.cos(endAngleinRadiant)} ${radius * Math.sin(endAngleinRadiant)}
    L ${smallRadius * Math.cos(endAngleinRadiant)} ${smallRadius * Math.sin(endAngleinRadiant)}
    A ${smallRadius} ${smallRadius}  0 ${largeArcFlag} 0  ${smallRadius * Math.cos(startAngleinRadiant)} ${smallRadius * Math.sin(startAngleinRadiant)}
    L ${radius * Math.cos(startAngleinRadiant)} ${radius * Math.sin(startAngleinRadiant)}
    `
}

const citySvgData = (city: City) => {
    const flashsPath = pieChartPath(
        42,
        10,
        0,
        city.flashs_count * 359.9 / city.invaders_count
    )
    const deadsPath = pieChartPath(
        42,
        10,
        (city.flashs_count) * 359.9 / city.invaders_count,
        (city.flashs_count + city.deads_count) * 359.9 / city.invaders_count
    )
    const hintsPath = pieChartPath(
        40,
        6,
        (city.flashs_count + city.deads_count) * 359.9 / city.invaders_count,
        (city.flashs_count + city.deads_count + city.hints_count) * 359.9 / city.invaders_count
    )
    
    const unfoundPath = pieChartPath(
        40,
        6,
        (city.flashs_count + city.hints_count + city.deads_count) * 359.9 / city.invaders_count,
        359.9
    )
    return `<svg
        xmlns='http://www.w3.org/2000/svg'
        width='100'
        height='100'
        viewBox='-50 -50 100 100'>
        <path
            d='${flashsPath}'
            fill='#2bcc23'
            fill-opacity='1.0'/>
        <path
            d='${deadsPath}'
            fill='#444444'
            fill-opacity='1.0'/>
        <path
            d='${hintsPath}'
            fill='#00acff'
            fill-opacity='1.0'/>
        <path
            d='${unfoundPath}'
            fill='#999999'
            fill-opacity='1.0'/>
            
    </svg>
    `
}

const healthBarSvg = (health: number, total: number) => {    
    const margin = 20
    const width = 1000
    const height = 100
    const grey = '#222222'
    const green = '#2bcc23'

    const bar_counts = [
        [0, 1],
        [10, 2],
        [50, 3],
        [100, 4],
        [200, 5],
        [300, 6],
        [400, 7],
        [500, 8],
        [750, 9],
        [1000, 10],
    ]

    const bars = Math.max(
        ..._.filter(bar_counts, ([c, b]) => c <= total).map(([c, b]) => b)    
    )

    const barWidth = (width + margin) / bars

    return `
        <svg
        xmlns='http://www.w3.org/2000/svg'
        width='${width}'
        height='${height}'
        viewBox='0 0 ${width} ${height}'>
        <defs>
            <clipPath id="myClip">
                <rect rx="${margin}" width="${width - margin}" height="${height}"/>
            </clipPath>
        </defs>

        <g clip-path="url(#myClip)">

        ${_.range(bars).map(i => {
            const minHealth = i * total * 1.0 / bars
            const maxHealth = (i + 1) * total * 1.0 / bars

            const healthProp = (health - minHealth) / (maxHealth - minHealth)
            if (health <= minHealth) {
                return `<rect
                    x="${i*barWidth}"
                    width="${barWidth - margin}"
                    height="${height}"
                    fill='${grey}'/>`
            }
            else if (health > maxHealth) {
                return `<rect
                    x="${i*barWidth}"
                    width="${barWidth - margin}"
                    height="${height}"
                    fill='${green}'/>`
            }
            else {
                return `
                    <rect
                        x="${i*barWidth}"
                        width="${barWidth - margin}"
                        height="${height}"
                        fill='${grey}'/>
                    <rect
                        x="${i*barWidth}"
                        width="${healthProp * (barWidth - margin)}"
                        height="${height}"
                        fill='${green}'/>   
                `
            }
            
            }
        )}
        </g>

    </svg>
    `
}

const svgtoUrlData = (svg: string) => [
    "data:image/svg+xml",
    encodeURI(svg.replaceAll("\n", ' ').replaceAll(/\s+/g, ' ')).replaceAll("#", "%23")
].join(",")

export const cityIconUrl = (city: City) => svgtoUrlData(
    healthBarSvg(city.flashs_count, city.invaders_count)
)

export const cityIcon = (city: City) => ({
    url: cityIconUrl(city),
    anchor: new google.maps.Point(50, 5),
    scaledSize: new google.maps.Size(100, 10)
})

export const healthBar = (health: number, total: number) => svgtoUrlData(
    healthBarSvg(health, total)
)