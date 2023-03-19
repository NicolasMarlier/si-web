interface Invader {
    image: string
    point: integer
    city_id: integer
    city_name: string
    name: string
    space_id: integer
    date_pos: string
    date_flash: string
    position: Position | undefined
}

interface InvadersGroup {
    name: string
    points: integer
    date; string
    invaders: Invader[]
}
interface Position {
    lat: number,
    lng: number
}