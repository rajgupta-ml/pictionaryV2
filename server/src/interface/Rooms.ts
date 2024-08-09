export interface Rooms {
    subscribers: Set<Map<string, string>> ;
    roomType : "Private" | "Global"
}

