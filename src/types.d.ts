interface Invader {
    image: string
    hosted_image_url: string
    hosted_image_30_url: string
    hosted_image_300_url: string
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