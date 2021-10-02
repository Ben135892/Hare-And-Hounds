export default interface Player {
    id: number,
    name: string,
    socket_id: string,
    is_runner: boolean,
    is_hosting: boolean,
    game_id: string
}