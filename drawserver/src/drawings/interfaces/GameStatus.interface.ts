
export interface GameStatus {
    time: number;
    gameState: GameState;
    object: string;
}

export enum GameState {
    STARTED = "STARTED",
    WAITING = "WAITING",
    VOTING = "VOTING",
    ENDED = "ENDED"
}
