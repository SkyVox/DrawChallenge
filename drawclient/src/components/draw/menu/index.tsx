import React, { useCallback, useEffect, useState } from 'react';
import { Client } from '../../../pages/main';
import { socket } from '../../../shared/socketConnection';

import {
    Container
} from './styles';

interface Props {
    user: Client;
    setClient: React.Dispatch<React.SetStateAction<Client>>;
}

enum GameState {
    STARTED,
    WAITING,
    VOTING,
    ENDED
}

interface GameSettings {
    time: number;
    objectDraw: string;
    gameState: GameState;
}

export const Menu: React.FC<Props> = ({ user, setClient }) => {
    const [ isMounted, setMounted ] = useState<boolean>(false);
    const [ state, setState ] = useState<GameSettings>({} as GameSettings);
    // Vote the drawings.

    const getStateDescription = useCallback(() => {
        if (state) {
            switch (state.gameState) {
                case GameState.STARTED:
                    return 'Game has started';
                case GameState.WAITING:
                    return 'Waiting for players!';
                case GameState.VOTING:
                    return 'Vote for your favorite draw!';
                case GameState.ENDED:
                    return 'Game has ended!';
            }
        }
    }, [state]);

    useEffect(() => {
        if (state && state.time > 0) {
            setTimeout(() => {
                setState((old) => ({...old, time: state.time - 1}));
            }, 1000);
        }
    }, [state]);

    useEffect(() => {
        if (isMounted) {
            socket.on('start-game', (state: GameSettings) => {
                setClient((old) => ({...old, isPlaying: true}));
                setState({...state, gameState: GameState.STARTED});
            });

            socket.on('end-game', () => {
                setClient((old) => ({...old, isPlaying: false}));
                setState((old) => ({...old, gameState: GameState.VOTING}));
            });
        }
    }, [isMounted, user]);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Container>
            {state && state.gameState === GameState.STARTED ?
                <>
                    <span>Time Remaining: {state.time}s</span>
                    <span>Object to draw: {state.objectDraw}</span>
                </> :
                <>{getStateDescription()}</>
            }
        </Container>
    );
}