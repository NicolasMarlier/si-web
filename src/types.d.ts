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

interface AbstractInvader {
    name: string,
    city_name: string,
    kind: string
    object: Invader | Hint | null
}

interface InvadersGroup {
    name: string
    points: integer
    date; string
    invaders: Invader[]
}
interface GeoPosition {
    lat: number,
    lng: number,
    heading: number | null
}
interface Position {
    lat: number,
    lng: number
}

interface Hint {
    id?: number,
    description: string
    placed_at: string
    position: Position
}

interface City {
    name: string
    slug: string
    position: Position
    first_flash_at: string | undefined
    invaders_count: integer
    flashs_count: integer
    hints_count: integer
    deads_count: integer
    searchables?: Searchable[]
}

interface Searchable {
    kind: string
    value: Hint | Invader | NotFound
}