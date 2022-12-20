
export interface User {
    name: string;
    client: any; // Socket Connection.
    id: string;
    boardImage: string;
    votes: number;
}