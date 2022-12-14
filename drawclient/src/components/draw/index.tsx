import React, { useState, useCallback, useEffect } from 'react';
import { Client } from '../../pages/main';
import { socket } from '../../shared/socketConnection';
import { Menu } from './menu';
import {
    Container,
    Board
} from './styles';

interface Props {
    user: Client;
    setClient: React.Dispatch<React.SetStateAction<Client>>;
}

interface PaintSettings {
    color: string;
    width: number;
}

export enum GameState {
    STARTED,
    WAITING,
    VOTING,
    ENDED
}

export interface GameSettings {
    time: number;
    object: string;
    gameState: GameState;
}

export const DrawBoard: React.FC<Props> = ({ user, setClient }) => {
    const [ isMounted, setMounted ] = useState<boolean>(false);
    const [ lastEvent, setLastEvent ] = useState<any>();
    const [ mouseDown, setMouseDown ] = useState<boolean>(false);
    const [ settings, setSettings ] = useState<PaintSettings>({} as PaintSettings);
    const [ currentVoteBoard, setCurrentVoteBoard ] = useState<string>('');
    const [ state, setState ] = useState<GameSettings>({} as GameSettings);

    const handleMouseMove = useCallback((event: any) => {
        if (mouseDown && user.isPlaying) {
            const rect = event.target.getBoundingClientRect();

            // Get positions
            const oldX = lastEvent?.clientX - rect.left;
            const oldY = lastEvent?.clientY - rect.top;
            const currentX = event.clientX - rect.left;
            const currentY = event.clientY - rect.top;

            const context = event.target.getContext("2d");

            context.beginPath();
            context.moveTo(oldX, oldY);
            context.lineTo(currentX, currentY);

            // Line settings.
            context.strokeStyle = settings.color;
            context.lineWidth = settings.width;
            context.lineCap = 'round';
            
            context.stroke();
            setLastEvent(event);
            setClient((old) => ({...old, boardImage: event.target.toDataURL()}));

            socket.emit('game-submit-board', {
                userId: user.userId,
                boardImageUrl: user.boardImage
            });
        }
    }, [user, lastEvent, mouseDown, settings]);

    const handleMouseDown = useCallback((event: any) => {
        setMouseDown(true);
        setLastEvent(event);
    }, [setMouseDown, setLastEvent]);

    const handleMouseUp = useCallback(() => {
        setMouseDown(false);
    }, [setMouseDown, setLastEvent]);

    const handleChangeColor = useCallback((event: any) => {
        setSettings((old) => ({...old, color: event.target.value}));
    }, [setSettings]);

    const handleChangeWidth = useCallback((event: any) => {
        setSettings((old) => ({...old, width: event.target.value}));
    }, [setSettings]);

    const handleClear = useCallback(() => {
        const canvas = document.getElementsByTagName('canvas')[0];
        const context = canvas.getContext("2d");

        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, []);

    const showDraw = useCallback((imageUrl: string) => {
        const canvas = document.getElementsByTagName('canvas')[0];
        const context = canvas.getContext("2d");

        if (context) {
            handleClear();
            const img = new Image();

            img.onload= () => {
                context.drawImage(img, 0, 0);
            }
            img.src = imageUrl;
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            socket.on('vote-board', ({ boardImage, userId }) => {
                showDraw(boardImage);
                setCurrentVoteBoard(userId);
                setState((old) => ({...old, gameState: GameState.VOTING}));
            });

            socket.on('game-winner', ({ boardImage }) => showDraw(boardImage));

            socket.on('disconnect', () => {
                setState({
                    time: 0,
                    object: '',
                    gameState: GameState.WAITING
                });
            });
        }
    }, [isMounted, user]);

    useEffect(() => {
        const canvas = document.getElementsByTagName('canvas')[0];
        canvas.style.height = '100%';
        canvas.style.width = '100%';

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        setSettings({
            color: 'black',
            width: 5
        });
        setState({
            time: 0,
            object: '',
            gameState: GameState.WAITING
        });
        setMounted(true);
    }, []);

    return (
        <Container className='main'>
            <Container className='board'>
                <Board canDraw={user.isPlaying || state.gameState === GameState.VOTING}>
                    <canvas id='paint-board'
                        onMouseMove={handleMouseMove}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    />
                </Board>
            </Container>

            <Container className='menu'>
                <select onChange={handleChangeColor}>
                    <option value={"black"} >Black</option>
                    <option value={"blue"} >Blue</option>
                    <option value={"green"} >Green</option>
                    <option value={"brown"} >Brown</option>
                    <option value={"yellow"} >Yellow</option>
                </select>
                <select onChange={handleChangeWidth}>
                    <option value={3} >3</option>
                    <option value={4} >4</option>
                    <option value={5} >5</option>
                    <option value={10} >10</option>
                    <option value={15} >15</option>
                </select>
                <button className='menu-interact' onClick={handleClear}>Clear</button>

                <Menu
                    user={user}
                    setClient={setClient}
                    currentVoteBoard={currentVoteBoard}
                    state={state}
                    setState={setState}
                />
            </Container>
        </Container>
    );
}
