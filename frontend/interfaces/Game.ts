export default interface Game {
    id: string,
    has_started: boolean,
    runner_been_found: boolean,
    round_number: number,
    location_update_number: number,   // used to reset timers
    location_update_interval: number, // e.g 60 seconds  
    location_show_time: number        // e.g 15 seconds
    runner_last_latitude: number,
    runner_last_longitude: number
}