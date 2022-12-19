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

export const DrawBoard: React.FC<Props> = ({ user, setClient }) => {
    const [ isMounted, setMounted ] = useState<boolean>(false);
    const [ lastEvent, setLastEvent ] = useState<any>();
    const [ mouseDown, setMouseDown ] = useState<boolean>(false);
    const [ settings, setSettings ] = useState<PaintSettings>({} as PaintSettings);

    const handleMouseMove = useCallback((event: any) => {
        if (mouseDown && user.isPlaying) {
            const rect = event.target.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const context = event.target.getContext("2d");

            context.beginPath();
            //context.moveTo(x, y);
            context.lineTo(x, y);

            // Line settings.
            context.strokeStyle = settings.color;
            context.lineWidth = settings.width;
            context.lineCap = 'round';
            
            context.stroke();
            setLastEvent(event);
            setClient((old) => ({...old, boardImage: event.target.toDataURL()}));

            socket.emit('game-submit-board', {
                userId: user.userId,
                image: user.boardImage
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

    useEffect(() => {
        if (isMounted) {
            socket.on('vote-board', (imageUrl: string) => {
                const canvas = document.getElementsByTagName('canvas')[0];
                const context = canvas.getContext("2d");

                if (context) {
                    handleClear();
                    const img = new Image();

                    img.onload=function(){
                        context.drawImage(img, 0, 0);
                    }
                    img.src = imageUrl;
                }
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
        setMounted(true);
    }, []);

    return (
        <Container className='main'>
            <Container className='board'>
                <Board>
                    <canvas id='paint-board' onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} />
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
                <button onClick={handleClear}>Clear</button>

                <Menu user={user} setClient={setClient} />
            </Container>
        </Container>
    );
}
