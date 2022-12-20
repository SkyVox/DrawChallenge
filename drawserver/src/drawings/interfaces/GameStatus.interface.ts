
export interface GameStatus {
    time: number;
    gameState: GameState;
    object: string;
}

export enum GameState {
    STARTED,
    WAITING,
    VOTING,
    ENDED
}
