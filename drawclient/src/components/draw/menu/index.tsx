import React, { useCallback, useEffect, useState } from 'react';
import { GameSettings, GameState } from '..';
import { Client } from '../../../pages/main';
import { socket } from '../../../shared/socketConnection';

import {
    Container
} from './styles';

interface UpdateStatus {
    time: number;
    object: string;
    gameState: "STARTED" | "WAITING" | "VOTING" | "ENDED";
}

interface Props {
    user: Client;
    setClient: React.Dispatch<React.SetStateAction<Client>>;
    currentVoteBoard: string;
    state: GameSettings;
    setState: React.Dispatch<React.SetStateAction<GameSettings>>;
}

export const Menu: React.FC<Props> = ({ user, setClient, currentVoteBoard, state, setState }) => {
    const [ isMounted, setMounted ] = useState<boolean>(false);

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

    const handleCastVote = useCallback(() => {
        socket.emit('cast-vote', {
            userId: user.userId,
            voteCastUserId: currentVoteBoard
        });
    }, [user, currentVoteBoard]);

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

            socket.on('game-status', ({ time, object, gameState }: UpdateStatus) => {
                setState({
                    time,
                    object,
                    gameState: GameState[gameState]
                });
            });
        }
    }, [isMounted, user]);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Container>
            {
                state && state.gameState === GameState.STARTED &&
                <>
                    <span>Time Remaining: {state.time}s</span>
                    <span>Object to draw: {state.object}</span>
                </>
            }

            {
                state && state.gameState === GameState.VOTING &&
                <button onClick={handleCastVote}>Vote This Draw</button>
            }

            {
                state && (state.gameState === GameState.WAITING || state.gameState === GameState.ENDED) &&
                <>{getStateDescription()}</>
            }
        </Container>
    );
}